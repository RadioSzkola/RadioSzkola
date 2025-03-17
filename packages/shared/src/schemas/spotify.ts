import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { timestamp } from "./utils";
import { userTable } from "./user";
import { relations } from "drizzle-orm";
import { schoolTable } from "./school";

export const spotifyTokenTable = sqliteTable("spotifyToken", {
    id: integer("id").primaryKey().notNull(),
    userId: text("userId")
        .notNull()
        .references(() => userTable.id),
    access: text("access").notNull(),
    refresh: text("refresh").notNull(),
    schoolId: text("schoolId")
        .notNull()
        .references(() => schoolTable.id),
    ...timestamp,
});

export const spotifyTokenRelations = relations(spotifyTokenTable, relation => ({
    user: relation.one(userTable, {
        fields: [spotifyTokenTable.userId],
        references: [userTable.id],
    }),
    school: relation.one(schoolTable, {
        fields: [spotifyTokenTable.schoolId],
        references: [schoolTable.id],
    }),
}));
