import { createUserSchema, userLoginSchema } from "@rs/shared/models";
import { Hono } from "hono";
import { db } from "../db";
import { userTable } from "@rs/shared/schemas";
import { SqliteError } from "better-sqlite3";
import { generateId } from "lucia";
import lucia from "../auth";
import { ApiContext } from "../context";
import { ApiError } from "@rs/shared/error";
import { jsonSchemaValidator } from "../middlewares/validation";
import { userAuthGuard } from "../middlewares/auth";
import { hashPassword, verifyPassword } from "../crypto";
import { bodyLimit } from "hono/body-limit";
import { WEB_APP_PORT } from "../const";
import { cors } from "hono/cors";

export const webAuthRouterV1 = new Hono<ApiContext>();

webAuthRouterV1.use(
    cors({
        origin: [
            `http://localhost:${WEB_APP_PORT}`,
            `http://192.168.55.119:${WEB_APP_PORT}`,
            `http://192.168.68.131:${WEB_APP_PORT}`,
        ],
        allowMethods: ["POST"],
        allowHeaders: ["Content-Type", "Cookie"],
    }),
);

webAuthRouterV1.use(
    bodyLimit({
        maxSize: 1024, // 1kb
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

            return c.json({ data: user });
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

        return c.json({ data: user });
    },
);

webAuthRouterV1.post("/logout", userAuthGuard, async c => {
    const session = c.get("session");

    await lucia.invalidateSession(session.id);
    const cookie = lucia.createBlankSessionCookie().serialize();

    c.header("Set-Cookie", cookie);

    return c.json({ message: "Logout successful" }, 200);
});
