import dotenv from "dotenv";

export const SERVER_PORT = () => process.env.SERVER_PORT || "8080";
export const SERVER_URL = () =>
    process.env.SERVER_URL || "http://localhost:" + SERVER_PORT();

export const WEB_APP_PORT = () => process.env.WEB_APP_PORT || "5173";
export const WEB_APP_URL = () =>
    process.env.WEB_APP_URL || "http://localhost:" + WEB_APP_PORT();

export const MODE = () =>
    (process.env.NODE_ENV || "development") as "production" | "development";

export const DATABASE_PATH = () =>
    process.env.DATABASE_PATH || "./.local/sqlite.db";
export const DATABASE_MIGRATIONS_FOLDER = () => "./migrations";

export const ALLOWED_ORIGINS = () => {
    return [
        `http://localhost:${WEB_APP_PORT()}`,
        `http://192.168.55.119:${WEB_APP_PORT()}`,
        `http://192.168.68.131:${WEB_APP_PORT()}`,
        WEB_APP_URL(),
    ];
};

export const SPOTIFY_CLIENT_ID = () => process.env.SPOTIFY_CLIENT_ID || "";
export const SPOTIFY_CLIENT_SECRET = () =>
    process.env.SPOTIFY_CLIENT_SECRET || "";
export const SPOTIFY_REDIRECT_URI = () => SERVER_URL() + "/v1/spotify/callback";
export const SPOTIFY_TOKEN_URL = () => "https://accounts.spotify.com/api/token";
export const SPOTIFY_WEB_REDIRECT_URL = () => WEB_APP_URL();

export function setupDotenv() {
    if (MODE() === "development") {
        dotenv.config();
    }
}
