import { integer } from "drizzle-orm/sqlite-core";

export const timestamp = {
    createdAt: integer("createdAt")
        .notNull()
        .$defaultFn(() => Date.now()),
    updatedAt: integer("updatedAt")
        .notNull()
        .$default(() => Date.now())
        .$onUpdateFn(() => Date.now()),
};
