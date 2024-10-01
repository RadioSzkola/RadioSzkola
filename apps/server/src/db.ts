import { drizzle } from "drizzle-orm/better-sqlite3";
import SqliteDatabase from "better-sqlite3";
import { DATABASE_PATH } from "./const";
import * as schema from "@rs/shared/schemas";

const sqlite = new SqliteDatabase(DATABASE_PATH);
export const db = drizzle(sqlite, { schema });
