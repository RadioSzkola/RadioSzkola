import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "../const";
import { ApiContext } from "../context";

export const spotifyRouterV1 = new Hono<ApiContext>();

spotifyRouterV1.use(
    cors({
        origin: getAllowedOrigins(),
        allowMethods: ["GET", "PATCH", "DELETE", "POST"],
        credentials: true,
    }),
);

spotifyRouterV1.get("/init-spotify", async c => {});
spotifyRouterV1.get("/callback", async c => {});
spotifyRouterV1.get("/currently-playing", async c => {});
