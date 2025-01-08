import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { timestamp } from "./utils";
import { userTable } from "./user";
import { relations } from "drizzle-orm";

export const authIdTable = sqliteTable("authId", {
    id: text("id").primaryKey(),
    inUse: integer("inUse")
        .notNull()
        .$type<boolean>()
        .$default(() => false),
    userId: text("userId").references(() => userTable.id),
    expiresAt: integer("expiresAt")
        .notNull()
        .$defaultFn(() => Date.now() + 1000 * 60 * 60 * 24 * 7),
    ...timestamp,
});
export const authIdRelations = relations(authIdTable, relation => ({
    user: relation.one(userTable, {
        fields: [authIdTable.userId],
        references: [userTable.id],
    }),
}));
