import { Hono } from "hono";
import { ApiContext } from "../context";
import { cors } from "hono/cors";
import { CORS_ALLOWED_ORIGINS } from "../const";
import {
    bodyValidatorMiddleware,
    paramsValidatorMiddleware,
} from "../middlewares/validation";
import { useAuthRules } from "../auth";
import { db } from "../db";
import {
    AuthId,
    createAuthIdSchema,
    paginationOptionsSchema,
    updateAuthIdSchema,
    User,
} from "@rs/shared/models";
import { AppError } from "@rs/shared/error";
import { z } from "zod";
import { authIdTable } from "../schema";
import { eq } from "drizzle-orm";
import { parseBySchema } from "@rs/shared/validation";

export const authIdRouterV1 = new Hono<ApiContext>();

authIdRouterV1.use(
    cors({
        origin: CORS_ALLOWED_ORIGINS,
        allowMethods: ["POST", "GET", "PATCH", "DELETE"],
        credentials: true,
    }),
);

authIdRouterV1.get("/", async c => {
    const { data: queryData, error: queryError } = parseBySchema(
        {
            limit: c.req.query("limit"),
            offset: c.req.query("offset"),
        },
        paginationOptionsSchema,
    );

    if (queryError) {
        return c.json<AppError>(
            {
                code: "VALIDATION",
                data: queryError,
            },
            422,
        );
    }

    const { limit, offset } = queryData;

    const { error: authError, statusCode } = useAuthRules(c, {
        systemadmin: true,
    });

    if (authError) return c.json(authError, statusCode);

    let ids: AuthId[] = await db.query.authIdTable.findMany({
        limit,
        offset,
    });

    return c.json(ids);
});

authIdRouterV1.get("/:id", async c => {
    const { data: id, error: paramError } = parseBySchema(
        c.req.param("id"),
        z.string(),
    );

    if (paramError) {
        return c.json<AppError>(
            {
                code: "VALIDATION",
                data: paramError,
            },
            422,
        );
    }

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

    const { error: authError, statusCode } = useAuthRules(c, {
        member: u => u.id === authIdUser?.id,
        creator: u => u.id === authIdUser?.id,
        admin: u => u.schoolId === authIdUser?.schoolId,
        systemadmin: true,
    });

    if (authError) return c.json(authError, statusCode);

    return c.json(authId);
});

authIdRouterV1.post("/", async c => {
    const body = await c.req.json();
    const { data: createAuthIdData, error: bodyError } = parseBySchema(
        body,
        createAuthIdSchema,
    );

    if (bodyError) {
        return c.json<AppError>(
            {
                code: "VALIDATION",
                data: bodyError,
            },
            422,
        );
    }

    const { error: authError, statusCode } = useAuthRules(c, {
        systemadmin: true,
    });

    if (authError) return c.json(authError, statusCode);

    const authIds = await db
        .insert(authIdTable)
        .values(createAuthIdData)
        .returning();

    if (authIds.length === 0)
        return c.json<AppError>({ code: "DATABASE" }, 500);

    return c.json(authIds[0]);
});

authIdRouterV1.patch("/", async c => {
    const body = await c.req.json();
    const { data: updateAuthIdData, error: bodyError } = parseBySchema(
        body,
        updateAuthIdSchema,
    );

    if (bodyError) {
        return c.json<AppError>(
            {
                code: "VALIDATION",
                data: bodyError,
            },
            422,
        );
    }

    const { error: authError, statusCode } = useAuthRules(c, {
        systemadmin: true,
    });

    if (authError) return c.json(authError, statusCode);

    const authIds = await db
        .update(authIdTable)
        .set(updateAuthIdData)
        .returning();

    if (authIds.length === 0)
        return c.json<AppError>({ code: "DATABASE" }, 500);

    return c.json(authIds[0]);
});

authIdRouterV1.delete("/:id", async c => {
    const { data: id, error: paramError } = parseBySchema(
        c.req.param("id"),
        z.string(),
    );

    if (paramError) {
        return c.json<AppError>(
            {
                code: "VALIDATION",
                data: paramError,
            },
            422,
        );
    }

    const { error: authError, statusCode } = useAuthRules(c, {
        systemadmin: true,
    });

    if (authError) return c.json(authError, statusCode);

    const authId = await db
        .delete(authIdTable)
        .where(eq(authIdTable.id, id))
        .returning();

    if (authId.length === 0) return c.json<AppError>({ code: "DATABASE" }, 500);

    return c.json(authId[0]);
});
