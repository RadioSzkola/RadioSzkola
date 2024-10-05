import { Hono } from "hono";
import { cors } from "hono/cors";
import { WEB_APP_PORT } from "../const";
import { bodyLimit } from "hono/body-limit";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "@hono/node-server/conninfo";

export const testRouterV1 = new Hono();

testRouterV1.use(
    cors({
        origin: [
            `http://localhost:${WEB_APP_PORT}`,
            `http://192.168.55.119:${WEB_APP_PORT}`,
            `http://192.168.68.131:${WEB_APP_PORT}`,
        ],
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

    return c.json({ data: headers });
});
