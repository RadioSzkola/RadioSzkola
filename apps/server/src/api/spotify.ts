import { Hono } from "hono";
import { cors } from "hono/cors";
import {
    ALLOWED_ORIGINS,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI,
    SPOTIFY_TOKEN_URL,
} from "../const";
import { ApiContext } from "../context";
import { useAuthRules } from "../auth";
import { parseBySchema } from "@rs/shared/validation";
import { spotifyAdminInitSchema } from "@rs/shared/models";
import { AppError } from "@rs/shared/error";
import { db } from "../db";
import { URLSearchParams } from "node:url";
import { generateId } from "lucia";
import { spotifyTokenTable } from "../schema";

export const spotifyRouterV1 = new Hono<ApiContext>();

// A bit of a workaround
// I am a tad too lazy to craft a reasonable solution
// So here we go
let __UNSAFE_STATE__: string | null = null;
let __UNSAFE_USER_ID__: string | null = null;

spotifyRouterV1.use(
    cors({
        origin: ALLOWED_ORIGINS(),
        allowMethods: ["GET", "PATCH", "DELETE", "POST"],
        credentials: true,
    }),
);

spotifyRouterV1.get("/init-spotify", async c => {
    if (__UNSAFE_STATE__ !== null || __UNSAFE_USER_ID__ !== null) {
        return c.json<AppError>(
            {
                code: "UNKNOWN",
                message: "Too many spotify admin api requests.",
            },
            429,
        );
    }

    const body = await c.req.json();
    const { data: initData, error: validationError } = parseBySchema(
        body,
        spotifyAdminInitSchema,
    );

    if (validationError) {
        return c.json<AppError>(
            {
                code: "VALIDATION",
                data: validationError,
            },
            401,
        );
    }

    const token = await db.query.spotifyTokenTable.findFirst({
        where: (fields, operators) => operators.eq(fields.id, initData.tokenId),
    });

    if (!token) {
        return c.json<AppError>(
            {
                code: "DATABASE",
                message: "Token not found.",
            },
            404,
        );
    }

    const {
        error: authError,
        statusCode,
        user,
    } = useAuthRules(c, {
        systemadmin: true,
        admin: u => u.id === token.userId,
    });

    if (authError) {
        return c.json(authError, statusCode);
    }

    __UNSAFE_STATE__ = generateId(32).toString();
    __UNSAFE_USER_ID__ = user.id;

    const params = new URLSearchParams({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID(),
        redirect_uri: SPOTIFY_REDIRECT_URI(),
        scope: "user-read-currently-playing",
        state: __UNSAFE_STATE__,
    });

    return c.redirect(
        `https://accounts.spotify.com/authorize?${params.toString()}`,
    );
});

spotifyRouterV1.get("/callback", async c => {
    if (__UNSAFE_STATE__ === null || __UNSAFE_USER_ID__ === null) {
        return c.json<AppError>({
            code: "UNKNOWN",
            message: "Unsafe state mismatch.",
        });
    }

    const { code, state } = c.req.query();

    if (!code || !state) {
        return c.json<AppError>(
            { code: "VALIDATION", message: "shit", data: {} },
            401,
        );
    }

    if (state !== __UNSAFE_STATE__) {
        return c.json<AppError>(
            {
                code: "UNKNOWN",
                message: "State mismatch",
            },
            400,
        );
    }

    const response = await fetch(SPOTIFY_TOKEN_URL(), {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
                "Basic " +
                Buffer.from(
                    `${SPOTIFY_CLIENT_ID()}:${SPOTIFY_CLIENT_SECRET()}`,
                ).toString("base64"),
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: SPOTIFY_REDIRECT_URI(),
        }).toString(),
    });

    const data = await response.json();

    if (data.error) {
        return c.json<AppError>(
            { code: "UNKNOWN", message: "Spotify", data: data.error },
            400,
        );
    }

    if (!data.access_token || !data.refresh_token) {
        return c.json<AppError>({
            code: "UNKNOWN",
            message: "Spotify; Missing tokens",
        });
    }

    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

    await db.insert(spotifyTokenTable).values({
        userId: __UNSAFE_USER_ID__,
        access: accessToken,
        refresh: refreshToken,
    });

    __UNSAFE_STATE__ = null;
    __UNSAFE_USER_ID__ = null;

    return c.redirect("/");
});

spotifyRouterV1.get("/currently-playing", async c => {});
