import { Hono } from "hono";
import { cors } from "hono/cors";
import { WEB_APP_PORT } from "../const";
import { bodyLimit } from "hono/body-limit";

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

testRouterV1.get("/headers", async c => {
    const headers = c.req.header();

    return c.json({ data: headers });
});
