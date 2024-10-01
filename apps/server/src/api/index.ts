import { Hono } from "hono";
import { logger } from "hono/logger";
import { ApiContext } from "../context";
import { authRouterV1 } from "./auth";
import { cors } from "hono/cors";

export const api = new Hono<ApiContext>();

api.use(logger());
api.use(
    cors({
        origin: "*",
    }),
);

api.route("/v1", authRouterV1);
