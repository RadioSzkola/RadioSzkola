import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "../const";
import { bodyLimit } from "hono/body-limit";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "@hono/node-server/conninfo";
import { apiAuth } from "../middlewares/auth";
import { ApiError } from "@rs/shared/error";
import { ApiResponse, updateUserSchema } from "@rs/shared/models";
import { jsonSchemaValidator } from "../middlewares/validation";
import { db } from "../db";
import { userTable } from "../schema";
import { eq } from "drizzle-orm";

export const accountRouterV1 = new Hono();

accountRouterV1.use(
    cors({
        origin: getAllowedOrigins(),
        allowMethods: ["GET", "PATCH"],
    }),
);

accountRouterV1.use(
    bodyLimit({
        maxSize: 4 * 1024, // 4kb
    }),
);

accountRouterV1.use(
    rateLimiter({
        windowMs: 1 * 60 * 1000,
        limit: 100,
        standardHeaders: "draft-6",
        keyGenerator: c => getConnInfo(c).remote.address ?? "",
    }),
);

accountRouterV1.get("/", apiAuth, async c => {
    const user = c.get("user");

    if (!user) {
        return c.json<ApiError>({ code: "AUTH" }, 401);
    }

    return c.json<ApiResponse>({ data: user });
});

accountRouterV1.patch(
    "/",
    apiAuth,
    jsonSchemaValidator(updateUserSchema),
    async c => {
        const user = c.get("user");
        const updateUserData = c.req.valid("json");

        if (!user) {
            return c.json<ApiError>({ code: "AUTH" }, 401);
        }

        const updatedUsers = await db
            .update(userTable)
            .set(updateUserData)
            .where(eq(userTable.id, user.id))
            .returning();

        if (updatedUsers.length === 0) {
            return c.json<ApiError>({ code: "DATABASE" }, 400);
        }

        return c.json<ApiResponse>({ data: updatedUsers[0] });
    },
);

accountRouterV1.patch(
    "/:id",
    apiAuth,
    jsonSchemaValidator(updateUserSchema),
    async c => {
        const user = c.get("user");
        const updateUserData = c.req.valid("json");
        const params = c.req.param();

        if (!user) {
            return c.json<ApiError>({ code: "AUTH" }, 401);
        }

        if (user.role !== "admin") {
            return c.json<ApiError>({ code: "AUTH" }, 401);
        }

        const updatedUsers = await db
            .update(userTable)
            .set(updateUserData)
            .where(eq(userTable.id, params.id))
            .returning();

        if (updatedUsers.length === 0) {
            return c.json<ApiError>({ code: "DATABASE" }, 400);
        }

        return c.json<ApiResponse>({ data: updatedUsers[0] });
    },
);
