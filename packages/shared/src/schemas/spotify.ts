import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "./utils";
import { userTable } from "./user";
import { relations } from "drizzle-orm";

export const spotifyTokenTable = sqliteTable("spotifyToken", {
    id: integer("id").primaryKey().notNull(),
    userId: text("userId")
        .notNull()
        .references(() => userTable.id),
    access: text("access").notNull(),
    refresh: text("refresh").notNull(),
    ...timestamp,
});

export const spotifyTokenRelations = relations(spotifyTokenTable, relation => ({
    user: relation.one(userTable, {
        fields: [spotifyTokenTable.userId],
        references: [userTable.id],
    }),
}));
