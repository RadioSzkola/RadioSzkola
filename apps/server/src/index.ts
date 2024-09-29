import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PORT, setupConst } from "./const";
import { logger } from "hono/logger";
import { bodyLimit } from "hono/body-limit";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import { APIRouter } from "./api";

setupConst();

const app = new Hono();

app.route("/", APIRouter);

serve({
    fetch: app.fetch,
    port: PORT,
});
