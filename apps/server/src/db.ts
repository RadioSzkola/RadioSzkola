import { drizzle } from "drizzle-orm/better-sqlite3";
import SqliteDatabase from "better-sqlite3";
import { CRYPTO_ROOT_USER_PASSWORD, DATABASE_PATH } from "./const";
import * as schema from "@rs/shared/schemas";
import { hashPassword } from "./crypto";

const sqlite = new SqliteDatabase(DATABASE_PATH);
export const db = drizzle(sqlite, { schema });

export function setupDatabase() {
    (async () => {
        const mickiewicz = await db.query.schoolTable.findFirst({
            where: (fields, operators) => operators.eq(fields.id, "mickiewicz"),
        });

        if (!mickiewicz) {
            await db.insert(schema.schoolTable).values({
                id: "mickiewicz",
                city: "Racibórz",
                adress: "Racibórz",
                name: "II Liceum Ogólnokształcące im. Adam Mickiewicza w Racibórzu",
            });
        }

        const rootUser = await db.query.userTable.findFirst({
            where: (fields, operators) => operators.eq(fields.id, "root"),
        });

        if (!rootUser) {
            await db.insert(schema.userTable).values({
                id: "root",
                email: "root@radioszkola.pl",
                name: "root",
                role: "systemadmin",
                schoolId: "mickiewicz",
                passwordHash: await hashPassword(CRYPTO_ROOT_USER_PASSWORD),
            });
        }
    })();
}
