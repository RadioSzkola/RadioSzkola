import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PORT, setupConst } from "./const";
import { api } from "./api";

setupConst();

serve({
    fetch: api.fetch,
    port: PORT,
});
