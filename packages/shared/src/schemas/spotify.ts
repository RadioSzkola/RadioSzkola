import {
    integer,
    primaryKey,
    sqliteTable,
    text,
} from "drizzle-orm/sqlite-core";
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
    ...timestamp,
});

export const spotifySchoolTokenTable = sqliteTable("spotifySchoolToken", {
    schoolId: text("schoolId")
        .notNull()
        .references(() => schoolTable.id)
        .primaryKey(),
    spotifyTokenId: integer("spotifyTokenId")
        .notNull()
        .references(() => spotifyTokenTable.id),
    ...timestamp,
});

export const spotifyTokenRelations = relations(spotifyTokenTable, relation => ({
    user: relation.one(userTable, {
        fields: [spotifyTokenTable.userId],
        references: [userTable.id],
    }),
    schoolTokens: relation.many(spotifySchoolTokenTable),
}));

export const spotifySchoolTokenRelations = relations(
    spotifySchoolTokenTable,
    relation => ({
        token: relation.one(spotifyTokenTable, {
            fields: [spotifySchoolTokenTable.spotifyTokenId],
            references: [spotifyTokenTable.id],
        }),
        school: relation.one(schoolTable, {
            fields: [spotifySchoolTokenTable.schoolId],
            references: [schoolTable.id],
        }),
    }),
);
