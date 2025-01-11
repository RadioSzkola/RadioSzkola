import { serve } from "@hono/node-server";
import { SERVER_PORT, setupDotenv } from "./const";
import { api } from "./api";

setupDotenv();

serve({
    fetch: api.fetch,
    port: parseInt(SERVER_PORT()),
});
