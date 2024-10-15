import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { userTable } from "./user";

export const schoolTable = sqliteTable("school", {
    id: integer("id").primaryKey(),
    city: text("city").notNull(),
    adress: text("adress").notNull(),
    name: text("name").notNull(),
    createdAt: integer("createdAt")
        .notNull()
        .$defaultFn(() => Date.now()),
    updatedAt: integer("updatedAt")
        .notNull()
        .$default(() => Date.now())
        .$onUpdateFn(() => Date.now()),
});

export const schoolRelations = relations(schoolTable, relation => ({
    users: relation.many(userTable),
}));
