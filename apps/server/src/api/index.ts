import { Hono } from "hono";
import { logger } from "hono/logger";
import { ApiContext } from "../context";
import { webAuthRouterV1 } from "./auth";
import { userRouterV1 } from "./user";
import { rateLimiter } from "hono-rate-limiter";
import { getConnInfo } from "@hono/node-server/conninfo";
import { schoolRouterV1 } from "./school";
import { authMiddleware } from "../middlewares/auth";

export const api = new Hono<ApiContext>();

api.use(logger());
api.use(
    "*",
    rateLimiter({
        windowMs: 1 * 60 * 1000,
        limit: 100,
        standardHeaders: "draft-6",
        keyGenerator: c => getConnInfo(c).remote.address ?? "",
    }),
);
api.use("*", authMiddleware);

api.route("/v1/auth/web", webAuthRouterV1);
api.route("/v1/users", userRouterV1);
api.route("/v1/schools", schoolRouterV1);
