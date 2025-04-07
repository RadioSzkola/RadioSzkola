import { drizzle } from "drizzle-orm/d1";
import * as schema from "../database/schema";

export const tables = schema;

export function useDatabase() {
  return drizzle(hubDatabase(), { schema });
}
