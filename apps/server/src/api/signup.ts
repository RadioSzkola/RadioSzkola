import { hash } from "@node-rs/argon2";
import { createUserSchema } from "@rs/shared/models";
import { Hono } from "hono";
import { db } from "../db";
import { userTable } from "@rs/shared/schemas";
import { SqliteError } from "better-sqlite3";
import { generateId } from "lucia";
import lucia from "../auth";
import { parseBySchema } from "@rs/shared/validation";
import { Context } from "./context";
import { ApiError } from "@rs/shared/error";

export const signupRouterV1 = new Hono<Context>();

signupRouterV1.post("/signup/web", async c => {
    const body = await c.req.json();
    const { data, error } = parseBySchema(body, createUserSchema);

    if (error) {
        return c.json<ApiError>({ code: "AUTH" }, 422);
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
            return c.json<ApiError>({ code: "AUTH" }, 409);
        }
        return c.json<ApiError>({ code: "DATABASE" }, 409);
    }
});
