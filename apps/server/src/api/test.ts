import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "../const";
import { bodyLimit } from "hono/body-limit";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "@hono/node-server/conninfo";
import { ApiResponse } from "@rs/shared/models";

export const testRouterV1 = new Hono();

testRouterV1.use(
    cors({
        origin: getAllowedOrigins(),
        allowMethods: ["GET"],
    }),
);

testRouterV1.use(
    bodyLimit({
        maxSize: 1024, // 1kb
    }),
);

testRouterV1.use(
    rateLimiter({
        windowMs: 1 * 60 * 1000, // 1min
        limit: 100, // max 10 test requests per 1min per IP
        standardHeaders: "draft-6",
        keyGenerator: c => getConnInfo(c).remote.address ?? "",
    }),
);

testRouterV1.get("/headers", async c => {
    const headers = c.req.header();

    return c.json<ApiResponse>({ data: headers });
});
