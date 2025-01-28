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
import { lucia } from "../auth";
import { ApiContext } from "../context";
import { AppError } from "@rs/shared/error";
import { bodyValidatorMiddleware } from "../middlewares/validation";
import { createUserId, hashPassword, verifyPassword } from "../crypto";
import { getAllowedOrigins } from "../const";
import { cors } from "hono/cors";
import { parseBySchema } from "@rs/shared/validation";

export const webAuthRouterV1 = new Hono<ApiContext>();

webAuthRouterV1.use(
    cors({
        origin: getAllowedOrigins(),
        allowMethods: ["POST"],
    }),
);

webAuthRouterV1.post("/signup", async c => {
    const body = await c.req.json();
    const { data: signupData, error: bodyError } = parseBySchema(
        body,
        signupSchema,
    );

    if (bodyError) {
        return c.json<AppError>(
            {
                code: "VALIDATION",
                data: bodyError,
            },
            422,
        );
    }

    const passwordHash = await hashPassword(signupData.password);
    const userId = createUserId();

    // The default role
    const role: UserRole = "member";

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
        return c.json<AppError>({ code: "DATABASE" });
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

    const session = await lucia.createSession(user.id, {});
    const cookie = lucia.createSessionCookie(session.id).serialize();
    c.header("Set-Cookie", cookie, { append: true });

    return c.json(user);
});

webAuthRouterV1.post("/signupid", async c => {
    const body = await c.req.json();
    const { data: signupData, error: bodyError } = parseBySchema(
        body,
        signupIdSchema,
    );

    if (bodyError) {
        return c.json<AppError>(
            {
                code: "VALIDATION",
                data: bodyError,
            },
            422,
        );
    }

    const passwordHash = await hashPassword(signupData.password);
    const userId = createUserId();

    // The default role
    const userRole: UserRole = "member";

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

            const school = await db.query.schoolTable.findFirst({
                where: (fields, operators) =>
                    operators.eq(fields.id, signupData.schoolId),
            });

            if (!school) {
                return {
                    user: null,
                    error: { code: "DATABASE" } as AppError,
                    statusCode: 400 as ResponseInit,
                };
            }

            if (authId.userId) {
                return {
                    user: null,
                    error: { code: "DATABASE" } as AppError,
                    statusCode: 400 as ResponseInit,
                };
            }

            const insertedUsers = await db
                .insert(userTable)
                .values({
                    email: signupData.email,
                    name: signupData.name,
                    role: userRole,
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

            await db.update(authIdTable).set({
                userId: userId,
            });

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

    const session = await lucia.createSession(result.user.id, {});
    const cookie = lucia.createSessionCookie(session.id).serialize();
    c.header("Set-Cookie", cookie, { append: true });

    return c.json(result.user);
});

webAuthRouterV1.post("/login", async c => {
    const body = await c.req.json();
    const { data: loginData, error: bodyError } = parseBySchema(
        body,
        userLoginSchema,
    );

    if (bodyError) {
        return c.json<AppError>(
            {
                code: "VALIDATION",
                data: bodyError,
            },
            422,
        );
    }

    const selectedUser = await db.query.userTable.findFirst({
        where: (table, { eq }) => eq(table.email, loginData.email),
    });

    if (!selectedUser) {
        return c.json<AppError>({ code: "AUTHENTICATION" }, 401);
    }

    const passwordHash = selectedUser.passwordHash;
    const user: User = {
        id: selectedUser.id,
        email: selectedUser.email,
        name: selectedUser.name,
        role: selectedUser.role,
        schoolId: selectedUser.schoolId,
        createdAt: selectedUser.createdAt,
        updatedAt: selectedUser.updatedAt,
    };

    const isPasswordValid = await verifyPassword(
        passwordHash,
        loginData.password,
    );

    if (!isPasswordValid) {
        return c.json<AppError>({ code: "AUTHENTICATION" }, 401);
    }

    const session = await lucia.createSession(user.id, {});
    const cookie = lucia.createSessionCookie(session.id).serialize();
    c.header("Set-Cookie", cookie, { append: true });

    return c.json(user);
});

webAuthRouterV1.post("/logout", async c => {
    const session = c.get("session");

    if (!session) {
        return c.json<AppError>({ code: "AUTHENTICATION" }, 401);
    }

    await lucia.invalidateSession(session.id);
    const cookie = lucia.createBlankSessionCookie().serialize();
    c.header("Set-Cookie", cookie);

    return c.json({ message: "Wylogowanie powiodło się" });
});
