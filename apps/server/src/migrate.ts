import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import db from "./db";
import { DATABASE_MIGRATIONS_FOLDER } from "./const";

migrate(db, { migrationsFolder: DATABASE_MIGRATIONS_FOLDER });
