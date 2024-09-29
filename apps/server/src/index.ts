import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PORT, setupConst } from "./const";
import { logger } from "hono/logger";
import { bodyLimit } from "hono/body-limit";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";

setupConst();

const app = new Hono();

app.use(logger());
app.use(
    bodyLimit({
        maxSize: 4 * 1024 * 1024, // 4mb
        onError: c => {
            return c.json({ message: "overflow" }, 413);
        },
    }),
);
app.use(csrf());
app.use(secureHeaders());

app.get("/", c => {
    return c.text("helloWorld()");
});

serve({
    fetch: app.fetch,
    port: PORT,
});
