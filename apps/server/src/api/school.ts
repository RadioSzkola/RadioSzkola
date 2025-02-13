import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "../const";
import {
    bodyValidatorMiddleware,
    paginationValidatorMiddleware,
    paramsValidatorMiddleware,
} from "../middlewares/validation";
import { db } from "../db";
import {
    createSchoolSchema,
    paginationOptionsSchema,
    updateSchoolSchema,
} from "@rs/shared/models";
import { z } from "zod";
import { AppError } from "@rs/shared/error";
import { parseBySchema } from "@rs/shared/validation";
import { schoolTable } from "../schema";
import { eq } from "drizzle-orm";
import { ApiContext } from "../context";
import { useAuthRules } from "../auth";

export const schoolRouterV1 = new Hono<ApiContext>();

schoolRouterV1.use(
    cors({
        origin: getAllowedOrigins(),
        allowMethods: ["GET", "PATCH", "DELETE", "POST"],
        credentials: true,
    }),
);

schoolRouterV1.get("/", async c => {
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

    const schools = await db.query.schoolTable.findMany({
        limit,
        offset,
    });

    return c.json(schools[0]);
});

schoolRouterV1.post("/", async c => {
    const body = await c.req.json();
    const { data: createSchoolData, error: bodyError } = parseBySchema(
        body,
        createSchoolSchema,
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

    const schools = await db
        .insert(schoolTable)
        .values({
            id: createSchoolData.id,
            adress: createSchoolData.adress,
            city: createSchoolData.city,
            name: createSchoolData.name,
        })
        .returning();

    if (schools.length === 0)
        return c.json<AppError>({ code: "DATABASE" }, 500);

    return c.json(schools[0]);
});

schoolRouterV1.get("/:id", async c => {
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

    const school = await db.query.schoolTable.findFirst({
        where: (fields, operators) => operators.eq(fields.id, id),
    });

    if (!school) c.json<AppError>({ code: "DATABASE" }, 404);

    return c.json(school);
});

schoolRouterV1.patch("/:id", async c => {
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

    const body = await c.req.json();
    const { data: updateSchoolData, error: bodyError } = parseBySchema(
        body,
        updateSchoolSchema,
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

    const school = await db.query.schoolTable.findFirst({
        where: (fields, operators) => operators.eq(fields.id, id),
    });

    if (!school) return c.json<AppError>({ code: "DATABASE" }, 404);

    const { error: authError, statusCode } = useAuthRules(c, {
        admin: user => user.schoolId === school.id,
        systemadmin: true,
    });

    if (authError) return c.json(authError, statusCode);

    const updatedSchools = await db
        .update(schoolTable)
        .set(updateSchoolData)
        .where(eq(schoolTable.id, id))
        .returning();

    if (updatedSchools.length === 0)
        return c.json<AppError>({ code: "DATABASE" }, 500);

    return c.json(updatedSchools[0]);
});

schoolRouterV1.delete("/:id", async c => {
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

    const deletedSchools = await db
        .delete(schoolTable)
        .where(eq(schoolTable.id, id))
        .returning();

    if (deletedSchools.length === 0)
        return c.json<AppError>({ code: "DATABASE" }, 500);

    return c.json(deletedSchools[0]);
});
