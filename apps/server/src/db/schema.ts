import { relations } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";
import { text } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const userTable = sqliteTable("user", {
    id: text("id").primaryKey(),
});

export type InsertUser = typeof userTable.$inferInsert;
export type User = typeof userTable.$inferSelect;
export const insertUserSchema = createInsertSchema(userTable);
export const userSchema = createSelectSchema(userTable);

export const sessionTable = sqliteTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: integer("expires_at").notNull(),
});

export type InsertSession = typeof sessionTable.$inferInsert;
export type Session = typeof sessionTable.$inferSelect;
export const insertSessionSchema = createInsertSchema(sessionTable);
export const sessionSchema = createSelectSchema(sessionTable);

export const userRelatons = relations(userTable, ({ many }) => ({
    sessions: many(sessionTable),
}));

export const sessionRelations = relations(sessionTable, ({ one }) => ({
    user: one(userTable, {
        fields: [sessionTable.userId],
        references: [userTable.id],
    }),
}));
