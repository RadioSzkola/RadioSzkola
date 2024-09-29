import { relations } from "drizzle-orm";
import { integer } from "drizzle-orm/sqlite-core";
import { text } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { UserRole } from "../models";

export const userTable = sqliteTable("user", {
    id: text("id").primaryKey(),
    role: text("role").notNull().$type<UserRole>(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("passwordHash").notNull(),
});

export const sessionTable = sqliteTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: integer("expires_at").notNull(),
});

export const userRelatons = relations(userTable, ({ many }) => ({
    sessions: many(sessionTable),
}));

export const sessionRelations = relations(sessionTable, ({ one }) => ({
    user: one(userTable, {
        fields: [sessionTable.userId],
        references: [userTable.id],
    }),
}));
