import dotenv from "dotenv";

export const PORT = process.env.PORT || "8080";
export const WEB_APP_PORT = process.env.WEB_APP_PORT || "3000";
export const ENV = (process.env.NODE_ENV || "development") as
    | "production"
    | "development";
export const DATABASE_PATH = process.env.DATABASE_PATH || "./.local/sqlite.db";
export const DATABASE_MIGRATIONS_FOLDER = "./migrations";

export function setupConst() {
    if (ENV === "development") {
        dotenv.config();
    }
}
