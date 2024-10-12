import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "../const";
import { bodyLimit } from "hono/body-limit";
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

testRouterV1.get("/headers", async c => {
    const headers = c.req.header();

    return c.json<ApiResponse>({ data: headers });
});
