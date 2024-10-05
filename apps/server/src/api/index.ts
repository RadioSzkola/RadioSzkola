import { Hono } from "hono";
import { logger } from "hono/logger";
import { ApiContext } from "../context";
import { webAuthRouterV1 } from "./auth";
import { testRouterV1 } from "./test";

export const api = new Hono<ApiContext>();

api.use(logger());

api.route("/v1/auth/web", webAuthRouterV1);
api.route("/v1/test", testRouterV1);
