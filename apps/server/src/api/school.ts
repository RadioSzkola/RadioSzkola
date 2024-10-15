import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "../const";
import { bodyLimit } from "hono/body-limit";
import {
    bodyValidatorMiddleware,
    paginationValidatorMiddleware,
    paramsValidatorMiddleware,
} from "../middlewares/validation";
import { db } from "../db";
import {
    ApiResponse,
    createSchoolSchema,
    updateSchoolSchema,
} from "@rs/shared/models";
import { z } from "zod";
import { ApiError } from "@rs/shared/error";
import { schoolTable } from "../schema";
import { eq } from "drizzle-orm";
import { ApiContext } from "../context";
import { useAuthRules } from "../auth";

export const schoolRouterV1 = new Hono<ApiContext>();

schoolRouterV1.use(
    cors({
        origin: getAllowedOrigins(),
        allowMethods: ["GET", "PATCH", "DELETE", "POST"],
    }),
);

schoolRouterV1.get("/", paginationValidatorMiddleware, async c => {
    const { limit, offset } = c.req.valid("query");

    const schools = await db.query.schoolTable.findMany({
        limit,
        offset,
    });

    return c.json<ApiResponse>({ data: schools });
});

schoolRouterV1.post(
    "/",
    bodyValidatorMiddleware(createSchoolSchema),
    async c => {
        const { error, statusCode } = useAuthRules(c, {
            systemadmin: true,
        });

        if (error) return c.json(error, statusCode);

        const createSchoolData = c.req.valid("json");
        const school = await db
            .insert(schoolTable)
            .values(createSchoolData)
            .returning();

        if (school.length === 0)
            return c.json<ApiError>({ code: "DATABASE" }, 500);

        return c.json<ApiResponse>({ data: school[0] });
    },
);

schoolRouterV1.get(
    "/:id",
    paramsValidatorMiddleware(z.object({ id: z.number() })),
    async c => {
        const params = c.req.valid("param");

        const school = await db.query.schoolTable.findFirst({
            where: (fields, operators) => operators.eq(fields.id, params.id),
        });

        if (!school) c.json<ApiError>({ code: "DATABASE" }, 404);

        return c.json<ApiResponse>({ data: school });
    },
);

schoolRouterV1.patch(
    "/:id",
    paramsValidatorMiddleware(z.object({ id: z.number() })),
    bodyValidatorMiddleware(updateSchoolSchema),
    async c => {
        const params = c.req.valid("param");
        const updateSchoolData = c.req.valid("param");

        const school = await db.query.schoolTable.findFirst({
            where: (fields, operators) => operators.eq(fields.id, params.id),
        });

        if (!school) return c.json<ApiError>({ code: "DATABASE" }, 404);

        const { error, statusCode } = useAuthRules(c, {
            admin: user => user.schoolId === school.id,
            systemadmin: true,
        });

        if (error) return c.json(error, statusCode);

        const updatedSchools = await db
            .update(schoolTable)
            .set(updateSchoolData)
            .where(eq(schoolTable.id, params.id))
            .returning();

        if (updatedSchools.length === 0)
            return c.json<ApiError>({ code: "DATABASE" }, 500);

        return c.json<ApiResponse>({ data: updatedSchools[0] });
    },
);

schoolRouterV1.delete(
    "/:id",
    paramsValidatorMiddleware(z.object({ id: z.number() })),
    async c => {
        const params = c.req.valid("param");

        const { error, statusCode } = useAuthRules(c, {
            systemadmin: true,
        });

        if (error) return c.json(error, statusCode);

        const deletedSchools = await db
            .delete(schoolTable)
            .where(eq(schoolTable.id, params.id))
            .returning();

        if (deletedSchools.length === 0)
            return c.json<ApiError>({ code: "DATABASE" }, 500);

        return c.json<ApiResponse>({ data: deletedSchools[0] });
    },
);
