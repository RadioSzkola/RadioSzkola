import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "./user";
import { timestamp } from "./utils";
import { spotifyTokenTable } from "./spotify";

export const schoolTable = sqliteTable("school", {
    id: text("id").primaryKey(),
    city: text("city").notNull(),
    adress: text("adress").notNull(),
    name: text("name").notNull(),
    ...timestamp,
});

export const schoolRelations = relations(schoolTable, relation => ({
    users: relation.many(userTable),
    spotifyToken: relation.many(spotifyTokenTable),
}));
