import { Hono } from "hono";
import { logger } from "hono/logger";
import { ApiContext } from "../context";
import { webAuthRouterV1 } from "./auth";
import { userRouterV1 } from "./user";
import { schoolRouterV1 } from "./school";
import { authMiddleware } from "../middlewares/auth";
import { authIdRouterV1 } from "./auth-id";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "../const";

export const api = new Hono<ApiContext>();

api.use(logger());
api.use(
    "*",
    cors({
        origin: getAllowedOrigins(),
        credentials: true,
    }),
);
api.use("*", authMiddleware);

api.route("/v1/auth/web", webAuthRouterV1);
api.route("/v1/auth/id", authIdRouterV1);
api.route("/v1/users", userRouterV1);
api.route("/v1/schools", schoolRouterV1);
