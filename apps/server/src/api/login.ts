import { Hono } from "hono";
import { Context } from "./context";
import { userLoginSchema } from "@rs/shared/models";
import { db } from "../db";
import { verify } from "@node-rs/argon2";
import lucia from "../auth";
import { jsonSchemaValidator } from "../middleware/validation";
import { ApiError } from "@rs/shared/error";

export const loginRouterV1 = new Hono<Context>();

loginRouterV1.post(
    "/login/web",
    jsonSchemaValidator(userLoginSchema),
    async c => {
        const loginData = c.req.valid("json");

        const dbUser = await db.query.userTable.findFirst({
            where: (table, { eq }) => eq(table.email, loginData.email),
        });

        if (!dbUser) {
            return c.json<ApiError>({ code: "AUTH" }, 422);
        }

        const { passwordHash, ...user } = dbUser;

        const isPasswordValid = await verify(passwordHash, loginData.password, {
            memoryCost: 20000,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
        });

        if (!isPasswordValid) {
            return c.json<ApiError>({ code: "AUTH" }, 422);
        }

        const session = await lucia.createSession(user.id, {});
        const cookie = lucia.createSessionCookie(session.id).serialize();

        c.header("Set-Cookie", cookie, { append: true });

        return c.json({ data: user });
    },
);
