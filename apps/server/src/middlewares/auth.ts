import { createMiddleware } from "hono/factory";
import { ApiContext } from "../context";
import { lucia } from "../auth";
import { AppError } from "@rs/shared/error";
import { db } from "../db";
import { setCookie } from "hono/cookie";

export const authMiddleware = createMiddleware<ApiContext>(async (c, next) => {
    c.set("session", null);
    c.set("user", null);

    const cookies = c.req.header("Cookie") ?? "";
    const sessionId = lucia.readSessionCookie(cookies);

    if (!sessionId) {
        return next();
    }

    const { session, user: sessionUser } =
        await lucia.validateSession(sessionId);

    if (session && session.fresh) {
        const cookie = lucia.createSessionCookie(session.id).serialize();
        c.header("Set-Cookie", cookie, { append: true });
    }

    if (!session) {
        const cookie = lucia.createBlankSessionCookie().serialize();
        c.header("Set-Cookie", cookie, { append: true });
        return next();
    }
    if (!sessionUser) {
        return next();
    }

    const user = await db.query.userTable.findFirst({
        where: (fields, operators) => operators.eq(fields.id, sessionUser.id),
    });

    if (!user) {
        return c.json<AppError>({ code: "DATABASE" }, 500);
    }

    const dbSession = await db.query.sessionTable.findFirst({
        where: (fields, operators) => operators.eq(fields.id, session.id),
    });

    if (!dbSession) return c.json<AppError>({ code: "DATABASE" }, 500);

    c.set("session", dbSession);
    c.set("user", user);

    await next();
});
