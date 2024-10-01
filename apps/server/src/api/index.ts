import { Hono } from "hono";
import { logger } from "hono/logger";
import { ApiContext } from "../context";
import { authRouterV1 } from "./auth";

export const api = new Hono<ApiContext>();

api.use(logger());

api.route("/v1", authRouterV1);
