import {
    ApiResponse,
    createUserSchema,
    userLoginSchema,
} from "@rs/shared/models";
import { Hono } from "hono";
import { db } from "../db";
import { userTable } from "@rs/shared/schemas";
import { SqliteError } from "better-sqlite3";
import { generateId } from "lucia";
import lucia from "../auth";
import { ApiContext } from "../context";
import { ApiError } from "@rs/shared/error";
import { jsonSchemaValidator } from "../middlewares/validation";
import { apiAuth } from "../middlewares/auth";
import { hashPassword, verifyPassword } from "../crypto";
import { bodyLimit } from "hono/body-limit";
import { getAllowedOrigins } from "../const";
import { cors } from "hono/cors";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "@hono/node-server/conninfo";

export const webAuthRouterV1 = new Hono<ApiContext>();

webAuthRouterV1.use(
    cors({
        origin: getAllowedOrigins(),
        allowMethods: ["POST"],
    }),
);

webAuthRouterV1.use(
    bodyLimit({
        maxSize: 1024, // 1kb
    }),
);

webAuthRouterV1.use(
    rateLimiter({
        windowMs: 1 * 60 * 1000, // 1min
        limit: 10, // max 10 auth requests per 1min per IP
        standardHeaders: "draft-6",
        keyGenerator: c => getConnInfo(c).remote.address ?? "",
    }),
);

webAuthRouterV1.post(
    "/signup",
    jsonSchemaValidator(createUserSchema),
    async c => {
        const signupData = c.req.valid("json");

        const passwordHash = await hashPassword(signupData.password);
        const id = generateId(32);

        try {
            const { passwordHash: _, ...user } = (
                await db
                    .insert(userTable)
                    .values({
                        email: signupData.email,
                        name: signupData.name,
                        role: signupData.role,
                        id,
                        passwordHash,
                    })
                    .returning()
            )[0];

            const session = await lucia.createSession(id, {});
            const cookie = lucia.createSessionCookie(session.id).serialize();

            c.header("Set-Cookie", cookie, { append: true });

            return c.json<ApiResponse>({ data: user });
        } catch (e) {
            if (
                e instanceof SqliteError &&
                e.code === "SQLITE_CONSTRAINT_UNIQUE"
            ) {
                return c.json<ApiError>({ code: "AUTH" }, 409);
            }
            return c.json<ApiError>({ code: "DATABASE" }, 409);
        }
    },
);

webAuthRouterV1.post(
    "/login",
    jsonSchemaValidator(userLoginSchema),
    async c => {
        const loginData = c.req.valid("json");

        const dbUser = await db.query.userTable.findFirst({
            where: (table, { eq }) => eq(table.email, loginData.email),
        });

        if (!dbUser) {
            return c.json<ApiError>({ code: "AUTH" }, 401);
        }

        const { passwordHash, ...user } = dbUser;

        const isPasswordValid = await verifyPassword(
            passwordHash,
            loginData.password,
        );

        if (!isPasswordValid) {
            return c.json<ApiError>({ code: "AUTH" }, 401);
        }

        const session = await lucia.createSession(user.id, {});
        const cookie = lucia.createSessionCookie(session.id).serialize();

        c.header("Set-Cookie", cookie, { append: true });

        return c.json<ApiResponse>({ data: user });
    },
);

webAuthRouterV1.post("/logout", apiAuth, async c => {
    const session = c.get("session");

    if (!session) {
        return c.json<ApiError>({ code: "AUTH" }, 401);
    }

    await lucia.invalidateSession(session.id);
    const cookie = lucia.createBlankSessionCookie().serialize();

    c.header("Set-Cookie", cookie);

    return c.json<ApiResponse>({ message: "Logout successful" }, 200);
});
