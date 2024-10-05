import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "../const";
import { bodyLimit } from "hono/body-limit";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "@hono/node-server/conninfo";
import { apiAuth } from "../middlewares/auth";
import { ApiError } from "@rs/shared/error";
import { ApiResponse } from "@rs/shared/models";
import { db } from "../db";

export const usersRouterV1 = new Hono();

usersRouterV1.use(
    cors({
        origin: getAllowedOrigins(),
        allowMethods: ["GET"],
    }),
);

usersRouterV1.use(
    bodyLimit({
        maxSize: 4 * 1024, // 4kb
    }),
);

usersRouterV1.use(
    rateLimiter({
        windowMs: 1 * 60 * 1000,
        limit: 100,
        standardHeaders: "draft-6",
        keyGenerator: c => getConnInfo(c).remote.address ?? "",
    }),
);

usersRouterV1.get("/", apiAuth, async c => {
    const user = c.get("user");
    const query = c.req.query();

    if (!user) {
        return c.json<ApiError>({ code: "AUTH" }, 401);
    }

    if (user.role !== "admin") {
        return c.json<ApiError>({ code: "AUTH" }, 401);
    }

    let limit = parseInt(query.limit ?? 100);
    let offset = parseInt(query.offset ?? 0);

    const selectedUsers = await db.query.userTable.findMany({
        limit,
        offset,
    });

    return c.json<ApiResponse>({ data: selectedUsers });
});

usersRouterV1.get("/:id", apiAuth, async c => {
    const user = c.get("user");
    const params = c.req.param();

    if (!user) {
        return c.json<ApiError>({ code: "AUTH" }, 401);
    }

    if (user.role !== "admin") {
        return c.json<ApiError>({ code: "AUTH" }, 401);
    }

    const selectedUser = await db.query.userTable.findFirst({
        where: (fields, operators) => operators.eq(fields.id, params.id),
    });

    if (!selectedUser) {
        return c.json<ApiError>({ code: "DATABASE" }, 400);
    }

    return c.json<ApiResponse>({ data: selectedUser });
});
