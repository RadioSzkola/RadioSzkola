import { defineConfig } from "drizzle-kit";
import { DATABASE_MIGRATIONS_FOLDER } from "./src/const";

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: DATABASE_MIGRATIONS_FOLDER,
    dialect: "sqlite",
});
