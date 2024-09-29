import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { helloWorld } from "@rs/shared";
import { PORT, setupConst } from "./const";

setupConst();

const app = new Hono();

app.get("/", c => {
    return c.text(helloWorld());
});

serve({
    fetch: app.fetch,
    port: PORT,
});
