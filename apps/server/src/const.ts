import dotenv from "dotenv";

export const PORT = process.env.PORT || "8080";
export const WEB_APP_PORT = process.env.WEB_APP_PORT || "3000";
export const ENV = (process.env.NODE_ENV || "development") as
  | "production"
  | "development";
export const DATABASE_PATH = process.env.DATABASE_PATH || "./.local/sqlite.db";
export const DATABASE_MIGRATIONS_FOLDER = "./migrations";

export function getAllowedOrigins(): string[] {
  return [
    `http://localhost:${WEB_APP_PORT}`,
    `http://192.168.55.119:${WEB_APP_PORT}`,
    `http://192.168.68.131:${WEB_APP_PORT}`,
  ];
}

export function setupConst() {
  if (ENV === "development") {
    dotenv.config();
  }
}
