import { relations } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { userTable } from "./user";

export const sessionTable = sqliteTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: integer("expires_at").notNull(),
});

export const sessionRelations = relations(sessionTable, relation => ({
    user: relation.one(userTable, {
        fields: [sessionTable.userId],
        references: [userTable.id],
    }),
}));
