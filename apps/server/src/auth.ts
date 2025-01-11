import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./db";
import { sessionTable, userTable } from "@rs/shared/schemas";
import { Lucia } from "lucia";
import { ENV } from "./const";
import { ApiContext } from "./context";
import { Session, User, UserRole, userRoleSchema } from "@rs/shared/models";
import { Context } from "hono";
import { AppError } from "@rs/shared/error";

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);
export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: ENV() === "production",
        },
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
    }
}

export type AuthRuleMatcher =
    | boolean
    | ((user: User, session: Session) => boolean)
    | ((user: User, session: Session) => Promise<boolean>);

export function useAuthRules(
    c: Context<ApiContext>,
    rules: { [P in UserRole]?: AuthRuleMatcher } = {},
):
    | { user: User; session: Session; error: null; statusCode: null }
    | { user: null; session: null; error: AppError; statusCode: ResponseInit } {
    const user = c.get("user");
    const session = c.get("session");

    if (!user || !session) {
        return {
            user: null,
            session: null,
            error: {
                code: "AUTHENTICATION",
            },
            statusCode: 401 as ResponseInit,
        };
    }

    if (Object.keys(rules).length === 0) {
        userRoleSchema._def.values.forEach(p => (rules[p] = true));
    }

    let isAuthorized = false;
    const matcher = rules[user.role];

    if (!matcher) {
        return {
            user: null,
            session: null,
            error: {
                code: "AUTHENTICATION",
            },
            statusCode: 401 as ResponseInit,
        };
    }

    if (typeof matcher === "function") {
        const result = matcher(user, session);

        if (result instanceof Promise) {
            result.then(x => (isAuthorized = x));
        } else {
            isAuthorized = result;
        }
    } else if (typeof matcher === "boolean") {
        isAuthorized = matcher;
    }

    if (isAuthorized) {
        return {
            user,
            session,
            error: null,
            statusCode: null,
        };
    }

    return {
        user: null,
        session: null,
        error: {
            code: "AUTHORIZATION",
        },
        statusCode: 401 as ResponseInit,
    };
}
