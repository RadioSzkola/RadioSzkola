import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PORT, setupConst } from "./const";
import { APIRouter } from "./api";

setupConst();

const app = new Hono();

app.route("/", APIRouter);

serve({
    fetch: app.fetch,
    port: PORT,
});

declare module "hono" {
    interface ContextVariableMap {}
}
