import { defineConfig } from "drizzle-kit";
import { DATABASE_MIGRATIONS_FOLDER, DATABASE_PATH } from "./src/const";

export default defineConfig({
    schema: "./src/schema.ts",
    out: DATABASE_MIGRATIONS_FOLDER,
    dialect: "sqlite",
    dbCredentials: {
        url: DATABASE_PATH,
    },
});
