import { hash } from "@node-rs/argon2";
import { createUserSchema, DbUser, User } from "@rs/shared/models";
import { Hono } from "hono";
import db from "../db";
import { userTable } from "../../../../packages/shared/src/db";
import { SqliteError } from "better-sqlite3";
import { generateId } from "lucia";
import lucia from "../auth/lucia";
import { parse } from "@rs/shared/validation";
import { createAPIError } from "@rs/shared/error";

export const signupRouterV1 = new Hono();

signupRouterV1.post("/signup/web", async c => {
    const body = await c.req.json();
    const { data, error } = parse(body, createUserSchema);

    if (error) {
        return c.json(
            createAPIError("VALIDATION", "Validation failed", error),
            400,
        );
    }

    const passwordHash = await hash(data.password, {
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
                    email: data.email,
                    name: data.name,
                    role: data.role,
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
        if (e instanceof SqliteError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return c.json(
                createAPIError(
                    "DATABASE",
                    "Konto z takim adresem email już istieje",
                    e.message,
                ),
                409,
            );
        }
        return c.json(createAPIError("UNKNOWN", "Błąd serwera :("), 500);
    }
});
