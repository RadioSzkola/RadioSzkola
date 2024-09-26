import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { helloWorld } from "@rs/shared";

const app = new Hono();

app.get("/", c => {
    return c.text(helloWorld());
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port,
});
