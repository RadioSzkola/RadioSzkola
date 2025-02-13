import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "./user";
import { timestamp } from "./utils";
import { spotifySchoolTokenTable } from "./spotify";

export const schoolTable = sqliteTable("school", {
    id: text("id").primaryKey(),
    city: text("city").notNull(),
    adress: text("adress").notNull(),
    name: text("name").notNull(),
    ...timestamp,
});

export const schoolRelations = relations(schoolTable, relation => ({
    users: relation.many(userTable),
    spotifySchoolToken: relation.one(spotifySchoolTokenTable, {
        fields: [schoolTable.id],
        references: [spotifySchoolTokenTable.schoolId],
    }),
}));
