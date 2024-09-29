import { Hono } from "hono";
import { signupRouterV1 } from "./signup";
import { logger } from "hono/logger";

export const APIRouter = new Hono();

APIRouter.use(logger());

APIRouter.route("/v1", signupRouterV1);
