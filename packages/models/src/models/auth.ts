import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sessionTable, userTable } from "../db/auth";

export type InsertUser = typeof userTable.$inferInsert;
export type User = typeof userTable.$inferSelect;
export const insertUserSchema = createInsertSchema(userTable);
export const userSchema = createSelectSchema(userTable);

export type InsertSession = typeof sessionTable.$inferInsert;
export type Session = typeof sessionTable.$inferSelect;
export const insertSessionSchema = createInsertSchema(sessionTable);
export const sessionSchema = createSelectSchema(sessionTable);
