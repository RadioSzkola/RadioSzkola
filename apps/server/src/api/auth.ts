import { hash, verify } from "@node-rs/argon2";
import { createUserSchema, userLoginSchema } from "@rs/shared/models";
import { Hono } from "hono";
import { db } from "../db";
import { userTable } from "@rs/shared/schemas";
import { SqliteError } from "better-sqlite3";
import { generateId } from "lucia";
import lucia from "../auth";
import { ApiContext } from "../context";
import { ApiError } from "@rs/shared/error";
import { jsonSchemaValidator } from "../middleware/validation";
import { userAuthGuard } from "../middleware/auth";

export const authRouterV1 = new Hono<ApiContext>();

authRouterV1.post(
    "/web/signup",
    jsonSchemaValidator(createUserSchema),
    async c => {
        const signupData = c.req.valid("json");

        const passwordHash = await hash(signupData.password, {
            memoryCost: 20000,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        });

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

authRouterV1.post(
    "/web/login",
    jsonSchemaValidator(userLoginSchema),
    async c => {
        const loginData = c.req.valid("json");

        const dbUser = await db.query.userTable.findFirst({
            where: (table, { eq }) => eq(table.email, loginData.email),
        });

        if (!dbUser) {
            return c.json<ApiError>({ code: "AUTH" }, 422);
        }

        const { passwordHash, ...user } = dbUser;

        const isPasswordValid = await verify(passwordHash, loginData.password, {
            memoryCost: 20000,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        });

        if (!isPasswordValid) {
            return c.json<ApiError>({ code: "AUTH" }, 422);
        }

        const session = await lucia.createSession(user.id, {});
        const cookie = lucia.createSessionCookie(session.id).serialize();

        c.header("Set-Cookie", cookie, { append: true });

        return c.json({ data: user });
    },
);

authRouterV1.post("/web/logout", userAuthGuard, async c => {
    const session = c.get("session");

    await lucia.invalidateSession(session.id);
    const cookie = lucia.createBlankSessionCookie().serialize();

    c.header("Set-Cookie", cookie);

    return c.json({ message: "Logout successful" }, 200);
});

authRouterV1.get("/user", userAuthGuard, async c => {
    const user = c.get("user");
    c.json({ data: user });
});
