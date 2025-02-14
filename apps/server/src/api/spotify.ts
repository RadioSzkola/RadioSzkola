import { Hono } from "hono";
import { cors } from "hono/cors";
import {
    ALLOWED_ORIGINS,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI,
    SPOTIFY_TOKEN_URL,
    SPOTIFY_WEB_REDIRECT_URL,
} from "../const";
import { ApiContext } from "../context";
import { useAuthRules } from "../auth";
import { parseBySchema } from "@rs/shared/validation";
import {
    spotifyAdminInitSchema,
    SpotifyToken,
    User,
    userSchema,
} from "@rs/shared/models";
import { AppError } from "@rs/shared/error";
import { db } from "../db";
import { URLSearchParams } from "node:url";
import { generateId } from "lucia";
import { schoolTable, spotifyTokenTable } from "../schema";
import { eq } from "drizzle-orm";

export const spotifyRouterV1 = new Hono<ApiContext>();

spotifyRouterV1.use(
    cors({
        origin: ALLOWED_ORIGINS(),
        allowMethods: ["GET", "PATCH", "DELETE", "POST"],
        credentials: true,
    }),
);

spotifyRouterV1.get("/init", async c => {
    const {
        error: authError,
        statusCode,
        user,
    } = useAuthRules(c, {
        systemadmin: true,
        admin: true,
    });

    if (authError) {
        return c.json(authError, statusCode);
    }

    const state = Buffer.from(JSON.stringify(user)).toString("base64");
    const params = new URLSearchParams({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID(),
        redirect_uri: SPOTIFY_REDIRECT_URI(),
        scope: "user-read-currently-playing",
        state: state,
    });

    console.log({ user, params });

    return c.redirect(
        `https://accounts.spotify.com/authorize?${params.toString()}`,
    );
});

spotifyRouterV1.get("/callback", async c => {
    const { code, state } = c.req.query();

    if (!code || !state) {
        return c.json<AppError>(
            { code: "VALIDATION", message: "shit", data: {} },
            401,
        );
    }

    const { error: validationError, data: user } = parseBySchema(
        JSON.parse(Buffer.from(state, "base64").toString()),
        userSchema,
    );

    if (validationError) {
        return c.json<AppError>(
            {
                code: "VALIDATION",
                data: validationError,
            },
            422,
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
        userId: user.id,
        access: accessToken,
        refresh: refreshToken,
        schoolId: user.schoolId,
    });

    return c.redirect(SPOTIFY_WEB_REDIRECT_URL());
});

spotifyRouterV1.get("/currently-playing", async c => {
    const { schoolId } = c.req.query();

    if (!schoolId) {
        return c.json<AppError>(
            {
                code: "VALIDATION",
                message: "schoolId query not present",
                data: {},
            },
            400,
        );
    }

    const token = await db.query.spotifyTokenTable.findFirst({
        where: (fields, operators) => operators.eq(fields.schoolId, schoolId),
    });

    if (!token) {
        return c.json<AppError>({
            code: "DATABASE",
            message: "Spotify token does not exist",
        });
    }

    try {
        const response = await fetch(
            "https://api.spotify.com/v1/me/player/currently-playing",
            {
                headers: {
                    Authorization: `Bearer ${token.access}`,
                },
            },
        );

        // Handle expired token
        if (response.status === 401 && token.refresh) {
            // Refresh the token
            const refreshResponse = await fetch(SPOTIFY_TOKEN_URL(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization:
                        "Basic " +
                        Buffer.from(
                            `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
                        ).toString("base64"),
                },
                body: new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: token.refresh,
                }).toString(),
            });

            const refreshData = await refreshResponse.json();
            const newAccessToken = refreshData.access_token;

            await db
                .update(spotifyTokenTable)
                .set({ access: newAccessToken })
                .where(eq(spotifyTokenTable.id, token.id));

            // Retry the request with new token
            return c.redirect("/v1/spotify/currently-playing");
        }

        const data = await response.json();
        return c.json(data);
    } catch (error) {
        return c.json<AppError>(
            {
                code: "FETCH",
                message: "Failed to fetch currently playing track",
                data: {
                    code: "UNKNOWN",
                    data: error,
                },
            },
            500,
        );
    }
});
