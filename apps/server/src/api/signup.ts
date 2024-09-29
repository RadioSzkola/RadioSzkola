import { hash } from "@node-rs/argon2";
import { createUserSchema } from "@rs/shared/models";
import { Hono } from "hono";
import db from "../db";
import { userTable } from "../../../../packages/shared/src/db";
import { SqliteError } from "better-sqlite3";
import { generateId } from "lucia";
import lucia from "../auth/lucia";

export const signupRouterV1 = new Hono();

signupRouterV1.post("/signup/web", async c => {
    const body = await c.req.parseBody();
    const { success, data, error } = createUserSchema.safeParse(body);

    if (!success) {
        return c.json({ code: "VALIDATION", data: error.flatten() }, 400);
    }

    const passwordHash = await hash(data.password, {
        memoryCost: 20000,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
    });

    const id = generateId(32);

    try {
        const user = await db
            .insert(userTable)
            .values({
                email: data.email,
                name: data.name,
                role: data.role,
                id,
                passwordHash,
            })
            .returning();

        const session = await lucia.createSession(id, {});
        const cookie = lucia.createSessionCookie(session.id).serialize();
        c.header("Set-Cookie", cookie, { append: true });

        return c.json({ data: user });
    } catch (e) {
        if (e instanceof SqliteError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return c.json({ code: "DATABASE", data: e.message }, 409);
        }
        return c.json({ code: "UNKNOWN", data: null }, 500);
    }
});
