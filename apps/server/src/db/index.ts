import { drizzle } from "drizzle-orm/better-sqlite3";
import BetterSqlite3Database from "better-sqlite3";
import { DATABASE_PATH } from "../const";
import * as schema from "./schema";

export const betterSqlite3Database = BetterSqlite3Database(DATABASE_PATH);
const db = drizzle(betterSqlite3Database, { schema });

export default db;
