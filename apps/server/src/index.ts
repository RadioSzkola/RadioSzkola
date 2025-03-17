import { serve } from "@hono/node-server";
import { CORS_ALLOWED_ORIGINS, loadEnvFile, SERVER_PORT } from "./const";
import { api } from "./api";
import { setupDatabase } from "./db";

setupDatabase();

serve({
    fetch: api.fetch,
    port: parseInt(SERVER_PORT),
});
