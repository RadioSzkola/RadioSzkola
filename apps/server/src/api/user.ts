import { Hono } from "hono";
import { cors } from "hono/cors";
import { CORS_ALLOWED_ORIGINS } from "../const";
import { AppError } from "@rs/shared/error";
import {
    paginationOptionsSchema,
    updateUserSchema,
    User,
} from "@rs/shared/models";
import {
    bodyValidatorMiddleware,
    paramsValidatorMiddleware,
} from "../middlewares/validation";
import { db } from "../db";
import { userTable } from "../schema";
import { parseBySchema } from "@rs/shared/validation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ApiContext } from "../context";
import { useAuthRules } from "../auth";

export const userRouterV1 = new Hono<ApiContext>();

userRouterV1.use(
    cors({
        origin: CORS_ALLOWED_ORIGINS,
        allowMethods: ["GET", "PATCH", "DELETE"],
        credentials: true,
    }),
);

userRouterV1.get("/", async c => {
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

    const {
        user,
        error: authError,
        statusCode,
    } = useAuthRules(c, {
        admin: true,
        systemadmin: true,
    });

    if (authError) return c.json(authError, statusCode);

    let users: User[] = [];

    if (user.role === "admin") {
        users = await db.query.userTable.findMany({
            limit,
            offset,
            where: (fields, operators) =>
                operators.eq(fields.schoolId, user.schoolId),
        });
    } else if (user.role === "systemadmin") {
        users = await db.query.userTable.findMany({
            limit,
            offset,
        });
    }

    return c.json({ data: users });
});

userRouterV1.get("/:id", async c => {
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

    const selectedUser = await db.query.userTable.findFirst({
        where: (fields, operators) => operators.eq(fields.id, id),
    });

    if (!selectedUser) return c.json<AppError>({ code: "DATABASE" }, 404);

    const { error, statusCode } = useAuthRules(c, {
        member: user => user.id === selectedUser.id,
        creator: user => user.id === selectedUser.id,
        admin: user => user.schoolId === selectedUser.schoolId,
        systemadmin: true,
    });

    if (error) return c.json(error, statusCode);

    return c.json(selectedUser);
});

userRouterV1.patch("/:id", async c => {
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
    const { data: updateUserData, error: bodyError } = parseBySchema(
        body,
        updateUserSchema,
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

    const selectedUser = await db.query.userTable.findFirst({
        where: (fields, operators) => operators.eq(fields.id, id),
    });

    if (!selectedUser) return c.json<AppError>({ code: "DATABASE" }, 400);

    const { error, statusCode } = useAuthRules(c, {
        member: user => user.id === selectedUser.id,
        creator: user => user.id === selectedUser.id,
        admin: user => user.schoolId === selectedUser.schoolId,
        systemadmin: true,
    });

    if (error) return c.json(error, statusCode);

    const updatedUsers = await db
        .update(userTable)
        .set(updateUserData)
        .where(eq(userTable.id, id))
        .returning();

    if (updatedUsers.length === 0)
        return c.json<AppError>({ code: "DATABASE" }, 400);

    return c.json(updatedUsers[0]);
});

userRouterV1.delete(
    "/:id",
    paramsValidatorMiddleware(z.object({ id: z.string() })),
    async c => {
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

        const selectedUser = await db.query.userTable.findFirst({
            where: (fields, operators) => operators.eq(fields.id, id),
        });

        if (!selectedUser) return c.json<AppError>({ code: "DATABASE" }, 400);

        const { error, statusCode } = useAuthRules(c, {
            member: user => user.id === selectedUser.id,
            creator: user => user.id === selectedUser.id,
            admin: user => user.schoolId === selectedUser.schoolId,
            systemadmin: true,
        });

        if (error) return c.json(error, statusCode);

        const deletedUsers = await db
            .delete(userTable)
            .where(eq(userTable.id, id))
            .returning();

        if (deletedUsers.length === 0)
            return c.json<AppError>({ code: "DATABASE" }, 500);

        return c.json(deletedUsers[0]);
    },
);
