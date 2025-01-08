import { Hono } from "hono";
import { ApiContext } from "../context";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "../const";
import {
    bodyValidatorMiddleware,
    paginationValidatorMiddleware,
    paramsValidatorMiddleware,
} from "../middlewares/validation";
import { useAuthRules } from "../auth";
import { db } from "../db";
import {
    AuthId,
    createAuthIdSchema,
    updateAuthIdSchema,
    User,
} from "@rs/shared/models";
import { AppError } from "@rs/shared/error";
import { z } from "zod";
import { authIdTable } from "../schema";
import { eq } from "drizzle-orm";

export const authIdRouterV1 = new Hono<ApiContext>();

authIdRouterV1.use(
    cors({
        origin: getAllowedOrigins(),
        allowMethods: ["POST", "GET", "PATCH", "DELETE"],
    }),
);

authIdRouterV1.get("/", paginationValidatorMiddleware, async c => {
    const { limit, offset } = c.req.valid("query");

    const { user, error, statusCode } = useAuthRules(c, {
        systemadmin: true,
    });

    if (error) return c.json(error, statusCode);

    let ids: AuthId[] = await db.query.authIdTable.findMany({
        limit,
        offset,
    });

    return c.json(ids);
});

authIdRouterV1.get(
    "/:id",
    paramsValidatorMiddleware(z.object({ id: z.string() })),
    async c => {
        const { id } = c.req.valid("param");

        const authId = await db.query.authIdTable.findFirst({
            where: (fields, operators) => operators.eq(fields.id, id),
        });

        if (!authId) {
            return c.json<AppError>({ code: "DATABASE" }, 404);
        }

        const authIdUser = await db.query.userTable.findFirst({
            where: (fields, operators) =>
                operators.eq(fields.id, authId.userId ?? ""),
        });

        const { error, statusCode } = useAuthRules(c, {
            member: u => u.id === authIdUser?.id,
            creator: u => u.id === authIdUser?.id,
            admin: u => u.schoolId === authIdUser?.schoolId,
            systemadmin: true,
        });

        if (error) return c.json(error, statusCode);

        return c.json(authId);
    },
);

authIdRouterV1.post(
    "/",
    bodyValidatorMiddleware(createAuthIdSchema),
    async c => {
        const createAuthId = c.req.valid("json");

        const { error, statusCode } = useAuthRules(c, {
            systemadmin: true,
        });

        if (error) return c.json(error, statusCode);

        const authIds = await db
            .insert(authIdTable)
            .values(createAuthId)
            .returning();

        if (authIds.length === 0)
            return c.json<AppError>({ code: "DATABASE" }, 500);

        return c.json(authIds[0]);
    },
);

authIdRouterV1.patch(
    "/",
    bodyValidatorMiddleware(updateAuthIdSchema),
    async c => {
        const updateAuthId = c.req.valid("json");

        const { error, statusCode } = useAuthRules(c, {
            systemadmin: true,
        });

        if (error) return c.json(error, statusCode);

        const authIds = await db
            .update(authIdTable)
            .set(updateAuthId)
            .returning();

        if (authIds.length === 0)
            return c.json<AppError>({ code: "DATABASE" }, 500);

        return c.json(authIds[0]);
    },
);

authIdRouterV1.delete(
    "/:id",
    paramsValidatorMiddleware(z.object({ id: z.string() })),
    async c => {
        const { id } = c.req.valid("param");

        const { error, statusCode } = useAuthRules(c, {
            systemadmin: true,
        });

        if (error) return c.json(error, statusCode);

        const authId = await db
            .delete(authIdTable)
            .where(eq(authIdTable.id, id))
            .returning();

        if (authId.length === 0)
            return c.json<AppError>({ code: "DATABASE" }, 500);

        return c.json(authId[0]);
    },
);
