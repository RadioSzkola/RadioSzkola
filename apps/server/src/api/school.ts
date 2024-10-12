import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "../const";
import { bodyLimit } from "hono/body-limit";
import {
    bodyValidator,
    paginationOptionsValidator,
    paramsValidator,
} from "../middlewares/validation";
import { db } from "../db";
import {
    ApiResponse,
    createSchoolSchema,
    updateSchoolSchema,
} from "@rs/shared/models";
import { z } from "zod";
import { ApiError } from "@rs/shared/error";
import { auth } from "../middlewares/auth";
import { schoolTable } from "../schema";
import { eq } from "drizzle-orm";

export const schoolRouterV1 = new Hono();

schoolRouterV1.use(
    cors({
        origin: getAllowedOrigins(),
        allowMethods: ["GET", "PATCH", "DELETE", "POST"],
    }),
);

schoolRouterV1.use(
    bodyLimit({
        maxSize: 8 * 1024 * 1024, // 8mb
    }),
);

schoolRouterV1.get("/", paginationOptionsValidator, async c => {
    const { limit, offset } = c.req.valid("query");

    const schools = await db.query.schoolTable.findMany({
        limit,
        offset,
    });

    return c.json<ApiResponse>({ data: schools });
});

schoolRouterV1.post("/", auth, bodyValidator(createSchoolSchema), async c => {
    const user = c.get("user");
    const createSchoolData = c.req.valid("json");

    if (!user) {
        return c.json<ApiError>({ code: "AUTHENTICATION" }, 401);
    }

    const isAuthorized = user.role === "systemadmin";

    if (!isAuthorized) {
        return c.json<ApiError>({ code: "AUTHORIZATION" }, 401);
    }

    const school = await db
        .insert(schoolTable)
        .values(createSchoolData)
        .returning();

    if (school.length === 0) {
        return c.json<ApiError>({ code: "DATABASE" }, 500);
    }

    return c.json<ApiResponse>({ data: school[0] });
});

schoolRouterV1.get(
    "/:id",
    paramsValidator(z.object({ id: z.number() })),
    async c => {
        const params = c.req.valid("param");

        const school = await db.query.schoolTable.findFirst({
            where: (fields, operators) => operators.eq(fields.id, params.id),
        });

        if (!school) {
            c.json<ApiError>({ code: "DATABASE" }, 404);
        }

        return c.json<ApiResponse>({ data: school });
    },
);

schoolRouterV1.patch(
    "/:id",
    auth,
    paramsValidator(z.object({ id: z.number() })),
    bodyValidator(updateSchoolSchema),
    async c => {
        const user = c.get("user");
        const params = c.req.valid("param");
        const updateSchoolData = c.req.valid("param");

        if (!user) {
            return c.json<ApiError>({ code: "AUTHENTICATION" }, 401);
        }

        const isAuthorized =
            user.role === "admin" || user.role === "systemadmin";

        if (!isAuthorized) {
            return c.json<ApiError>({ code: "AUTHORIZATION" });
        }

        const school = await db.query.schoolTable.findFirst({
            where: (fields, operators) => operators.eq(fields.id, params.id),
        });

        if (!school) {
            return c.json<ApiError>({ code: "DATABASE" }, 404);
        }

        if (user.role === "admin" && school.id !== user.schoolId) {
            return c.json<ApiError>({ code: "AUTHORIZATION" }, 401);
        }

        const updatedSchools = await db
            .update(schoolTable)
            .set(updateSchoolData)
            .where(eq(schoolTable.id, params.id))
            .returning();

        if (updatedSchools.length === 0) {
            return c.json<ApiError>({ code: "DATABASE" }, 500);
        }

        return c.json<ApiResponse>({ data: updatedSchools[0] });
    },
);

schoolRouterV1.delete(
    "/:id",
    auth,
    paramsValidator(z.object({ id: z.number() })),
    async c => {
        const user = c.get("user");
        const params = c.req.valid("param");

        if (!user) {
            return c.json<ApiError>({ code: "AUTHENTICATION" }, 401);
        }

        const isAuthorized =
            user.role === "admin" || user.role === "systemadmin";

        if (!isAuthorized) {
            return c.json<ApiError>({ code: "AUTHORIZATION" });
        }

        const school = await db.query.schoolTable.findFirst({
            where: (fields, operators) => operators.eq(fields.id, params.id),
        });

        if (!school) {
            return c.json<ApiError>({ code: "DATABASE" }, 404);
        }

        if (user.role === "admin" && school.id !== user.schoolId) {
            return c.json<ApiError>({ code: "AUTHORIZATION" }, 401);
        }

        const deletedSchools = await db
            .delete(schoolTable)
            .where(eq(schoolTable.id, params.id))
            .returning();

        if (deletedSchools.length === 0) {
            return c.json<ApiError>({ code: "DATABASE" }, 500);
        }

        return c.json<ApiResponse>({ data: deletedSchools[0] });
    },
);
