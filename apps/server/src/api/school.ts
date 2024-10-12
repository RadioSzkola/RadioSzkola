import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "../const";
import { bodyLimit } from "hono/body-limit";
import { paginationOptionsValidator } from "../middlewares/validation";
import { db } from "../db";
import { ApiResponse } from "@rs/shared/models";

export const schoolRouterV1 = new Hono();

schoolRouterV1.use(
    cors({
        origin: getAllowedOrigins(),
        allowMethods: ["GET", "PATCH", "DELETE", "POST"],
    }),
);

schoolRouterV1.use(
    bodyLimit({
        maxSize: 8 * 1024 * 1024, // 8mb
    }),
);

schoolRouterV1.get("/", paginationOptionsValidator, async c => {
    const { limit, offset } = c.req.valid("query");

    const schools = await db.query.schoolTable.findMany({
        limit,
        offset,
    });

    return c.json<ApiResponse>({ data: schools });
});
