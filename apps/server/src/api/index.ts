import { Hono } from "hono";
import { signupRouterV1 } from "./signup";
import { logger } from "hono/logger";
import { Context } from "./context";
import { loginRouterV1 } from "./login";

export const api = new Hono<Context>();

api.use(logger());

api.route("/v1", signupRouterV1);
api.route("/v1", loginRouterV1);
