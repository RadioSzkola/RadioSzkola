import { createMiddleware } from "hono/factory";
import { ApiContext } from "../context";
import lucia from "../auth";
import { ApiError } from "@rs/shared/error";
import { db } from "../db";

export const userAuthGuard = createMiddleware<ApiContext>(async (c, next) => {
    const cookies = c.req.header("Cookie") ?? "";

    const sessionId = lucia.readSessionCookie(cookies);

    if (!sessionId) {
        return c.json<ApiError>({ code: "AUTH" }, 401);
    }

    const { session, user: sessionUser } =
        await lucia.validateSession(sessionId);
    if (session && session.fresh) {
        const cookie = lucia.createSessionCookie(session.id).serialize();
        c.header("Set-Cookie", cookie, { append: true });
    } else {
        const cookie = lucia.createBlankSessionCookie().serialize();
        c.header("Set-Cookie", cookie, { append: true });
        return c.json<ApiError>({ code: "AUTH" }, 401);
    }

    const user = await db.query.userTable.findFirst({
        where: (fields, operators) => operators.eq(fields.id, sessionUser.id),
    });

    if (!user) {
        return c.json<ApiError>({ code: "DATABASE" }, 500);
    }

    c.set("session", {
        expiresAt: session.expiresAt.getDate(),
        id: session.id,
        userId: session.userId,
    });
    c.set("user", user);

    await next();
});
