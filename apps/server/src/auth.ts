import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./db";
import { sessionTable, userTable } from "@rs/shared/schemas";
import { Lucia } from "lucia";
import { ENV } from "./const";

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);
export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: ENV === "production",
        },
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
    }
}
