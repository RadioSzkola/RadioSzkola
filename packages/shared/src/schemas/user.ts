import { relations } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { UserRole } from "../models";
import { schoolTable } from "./school";
import { sessionTable } from "./session";
import { timestamp } from "./utils";
import { authIdTable } from "./auth-id";
import { spotifyTokenTable } from "./spotify";

export const userTable = sqliteTable("user", {
    id: text("id").primaryKey(),
    role: text("role").notNull().$type<UserRole>(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("passwordHash").notNull(),
    schoolId: text("schoolId")
        .notNull()
        .references(() => schoolTable.id),
    ...timestamp,
});

export const userRelatons = relations(userTable, relation => ({
    sessions: relation.many(sessionTable),
    spotifyTokens: relation.many(spotifyTokenTable),
    school: relation.one(schoolTable, {
        fields: [userTable.schoolId],
        references: [schoolTable.id],
    }),
}));
