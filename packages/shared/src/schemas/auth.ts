import { relations } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { UserRole } from "../models";
import { schoolTable } from "./school";

export const userTable = sqliteTable("user", {
    id: text("id").primaryKey(),
    role: text("role").notNull().$type<UserRole>(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("passwordHash").notNull(),
    schoolId: integer("schoolId")
        .notNull()
        .references(() => schoolTable.id),
    createdAt: integer("createdAt")
        .notNull()
        .$defaultFn(() => Date.now()),
    updatedAt: integer("updatedAt")
        .notNull()
        .$default(() => Date.now())
        .$onUpdateFn(() => Date.now()),
});

export const sessionTable = sqliteTable("session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => userTable.id),
    expiresAt: integer("expires_at").notNull(),
});

export const userRelatons = relations(userTable, relation => ({
    sessions: relation.many(sessionTable),
    school: relation.one(schoolTable, {
        fields: [userTable.schoolId],
        references: [schoolTable.id],
    }),
}));

export const sessionRelations = relations(sessionTable, relation => ({
    user: relation.one(userTable, {
        fields: [sessionTable.userId],
        references: [userTable.id],
    }),
}));
