import {
    createUserSchema,
    signupIdSchema,
    signupSchema,
    User,
    userLoginSchema,
    UserRole,
} from "@rs/shared/models";
import { Hono } from "hono";
import { db } from "../db";
import { authIdTable, userTable } from "@rs/shared/schemas";
import { SqliteError } from "better-sqlite3";
import { lucia } from "../auth";
import { ApiContext } from "../context";
import { AppError } from "@rs/shared/error";
import { bodyValidatorMiddleware } from "../middlewares/validation";
import { createUserId, hashPassword, verifyPassword } from "../crypto";
import { getAllowedOrigins } from "../const";
import { cors } from "hono/cors";

export const webAuthRouterV1 = new Hono<ApiContext>();

webAuthRouterV1.use(
    cors({
        origin: getAllowedOrigins(),
        allowMethods: ["POST"],
    }),
);

webAuthRouterV1.post(
    "/signup",
    bodyValidatorMiddleware(signupSchema),
    async c => {
        const signupData = c.req.valid("json");

        const passwordHash = await hashPassword(signupData.password);
        const id = createUserId();

        // The default role
        const role: UserRole = "member";

        try {
            const { passwordHash: _, ...user } = (
                await db
                    .insert(userTable)
                    .values({
                        email: signupData.email,
                        name: signupData.name,
                        role: role,
                        id,
                        passwordHash,
                        schoolId: signupData.schoolId,
                    })
                    .returning()
            )[0];

            const session = await lucia.createSession(id, {});
            const cookie = lucia.createSessionCookie(session.id).serialize();

            c.header("Set-Cookie", cookie, { append: true });

            return c.json(user);
        } catch (e) {
            if (
                e instanceof SqliteError &&
                e.code === "SQLITE_CONSTRAINT_UNIQUE"
            ) {
                return c.json<AppError>({ code: "DATABASE" }, 401);
            }
            return c.json<AppError>({ code: "UNKNOWN" }, 400);
        }
    },
);

webAuthRouterV1.post(
    "/signupid",
    bodyValidatorMiddleware(signupIdSchema),
    async c => {
        const signupData = c.req.valid("json");

        const passwordHash = await hashPassword(signupData.password);
        const userId = createUserId();

        // The default role
        const role: UserRole = "member";

        const result:
            | { user: User; error: null; statusCode: null }
            | { user: null; error: AppError; statusCode: ResponseInit } =
            await db.transaction(async tx => {
                const authId = await db.query.authIdTable.findFirst({
                    where: (fields, operators) =>
                        operators.eq(fields.id, signupData.authId),
                });

                if (!authId) {
                    return {
                        user: null,
                        error: { code: "DATABASE" } as AppError,
                        statusCode: 400 as ResponseInit,
                    };
                }

                if (authId.inUse) {
                    return {
                        user: null,
                        error: { code: "DATABASE" } as AppError,
                        statusCode: 400 as ResponseInit,
                    };
                }

                await db.update(authIdTable).set({
                    inUse: true,
                    userId: userId,
                });

                const insertedUsers = await db
                    .insert(userTable)
                    .values({
                        email: signupData.email,
                        name: signupData.name,
                        role: role,
                        id: userId,
                        passwordHash,
                        schoolId: signupData.schoolId,
                    })
                    .returning();

                if (insertedUsers.length !== 1) {
                    return {
                        user: null,
                        error: { code: "UNKNOWN" } as AppError,
                        statusCode: 400 as ResponseInit,
                    };
                }
                const insertedUser = insertedUsers[0];
                const user: User = {
                    id: insertedUser.id,
                    email: insertedUser.email,
                    name: insertedUser.name,
                    role: insertedUser.role,
                    schoolId: insertedUser.schoolId,
                    createdAt: insertedUser.createdAt,
                    updatedAt: insertedUser.updatedAt,
                };

                return {
                    user: user,
                    error: null,
                    statusCode: null,
                };
            });

        if (result.error) {
            return c.json<AppError>(result.error, result.statusCode);
        }

        return c.json(result.user);
    },
);

webAuthRouterV1.post(
    "/login",
    bodyValidatorMiddleware(userLoginSchema),
    async c => {
        const loginData = c.req.valid("json");

        const dbUser = await db.query.userTable.findFirst({
            where: (table, { eq }) => eq(table.email, loginData.email),
        });

        if (!dbUser) return c.json<AppError>({ code: "AUTHENTICATION" }, 401);

        const { passwordHash, ...user } = dbUser;

        const isPasswordValid = await verifyPassword(
            passwordHash,
            loginData.password,
        );

        if (!isPasswordValid)
            return c.json<AppError>({ code: "AUTHENTICATION" }, 401);

        const session = await lucia.createSession(user.id, {});
        const cookie = lucia.createSessionCookie(session.id).serialize();

        c.header("Set-Cookie", cookie, { append: true });

        return c.json(user);
    },
);

webAuthRouterV1.post("/logout", async c => {
    const session = c.get("session");

    if (!session) return c.json<AppError>({ code: "AUTHENTICATION" }, 401);

    await lucia.invalidateSession(session.id);
    const cookie = lucia.createBlankSessionCookie().serialize();

    c.header("Set-Cookie", cookie);

    return c.json({ message: "Wylogowanie powiodło się" });
});
