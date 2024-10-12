import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "../const";
import { bodyLimit } from "hono/body-limit";
import { apiAuth } from "../middlewares/auth";
import { ApiError } from "@rs/shared/error";
import { ApiResponse, updateUserSchema, User } from "@rs/shared/models";
import {
    bodySchemaValidator,
    paginationOptionsValidator,
    paramsSchemaValidator,
} from "../middlewares/validation";
import { db } from "../db";
import { userTable } from "../schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const userRouterV1 = new Hono();

userRouterV1.use(
    cors({
        origin: getAllowedOrigins(),
        allowMethods: ["GET", "PATCH", "DELETE"],
    }),
);

userRouterV1.use(
    bodyLimit({
        maxSize: 4 * 1024, // 4kb
    }),
);

userRouterV1.get("/", apiAuth, paginationOptionsValidator, async c => {
    const user = c.get("user");
    const { limit, offset } = c.req.valid("query");

    if (!user) {
        return c.json<ApiError>({ code: "AUTHENTICATION" }, 401);
    }

    const isAuthorized = user.role === "admin" || user.role === "systemadmin";
    if (!isAuthorized) {
        return c.json<ApiError>({ code: "AUTHORIZATION" }, 401);
    }

    let users: User[];

    if (user.role === "admin") {
        users = await db.query.userTable.findMany({
            limit,
            offset,
            where: (fields, operators) =>
                operators.eq(fields.schoolId, user.schoolId),
        });
    } else {
        users = await db.query.userTable.findMany({
            limit,
            offset,
        });
    }

    return c.json<ApiResponse>({ data: users });
});

userRouterV1.get(
    "/:id",
    apiAuth,
    paramsSchemaValidator(z.object({ id: z.string() })),
    async c => {
        const user = c.get("user");
        const params = c.req.valid("param");

        if (!user) {
            return c.json<ApiError>({ code: "AUTHENTICATION" }, 401);
        }

        const selectedUser = await db.query.userTable.findFirst({
            where: (fields, operators) => operators.eq(fields.id, params.id),
        });

        if (!selectedUser) {
            return c.json<ApiError>({ code: "DATABASE" }, 400);
        }

        const isAuthorized =
            (user.role === "member" && user.id === params.id) ||
            (user.role === "creator" && user.id === params.id) ||
            (user.role === "admin" &&
                selectedUser.schoolId === user.schoolId) ||
            user.role === "systemadmin";

        if (!isAuthorized) {
            return c.json<ApiError>({ code: "AUTHORIZATION" }, 401);
        }

        return c.json<ApiResponse>({ data: selectedUser });
    },
);

userRouterV1.patch(
    "/:id",
    apiAuth,
    bodySchemaValidator(updateUserSchema),
    paramsSchemaValidator(z.object({ id: z.string() })),
    async c => {
        const user = c.get("user");
        const updateUserData = c.req.valid("json");
        const params = c.req.valid("param");

        if (!user) {
            return c.json<ApiError>({ code: "AUTHENTICATION" }, 401);
        }

        const selectedUser = await db.query.userTable.findFirst({
            where: (fields, operators) => operators.eq(fields.id, params.id),
        });

        if (!selectedUser) {
            return c.json<ApiError>({ code: "DATABASE" }, 400);
        }

        const isAuthorized =
            (user.role === "member" && user.id === params.id) ||
            (user.role === "creator" && user.id === params.id) ||
            (user.role === "admin" &&
                selectedUser.schoolId === user.schoolId) ||
            user.role === "systemadmin";

        if (!isAuthorized) {
            return c.json<ApiError>({ code: "AUTHORIZATION" }, 401);
        }

        const updatedUsers = await db
            .update(userTable)
            .set(updateUserData)
            .where(eq(userTable.id, params.id))
            .returning();

        if (updatedUsers.length === 0) {
            return c.json<ApiError>({ code: "DATABASE" }, 400);
        }

        return c.json<ApiResponse>({ data: updatedUsers[0] });
    },
);

userRouterV1.delete(
    "/:id",
    apiAuth,
    paramsSchemaValidator(z.object({ id: z.string() })),
    async c => {
        const user = c.get("user");
        const params = c.req.valid("param");

        if (!user) {
            return c.json<ApiError>({ code: "AUTHENTICATION" }, 401);
        }

        const selectedUser = await db.query.userTable.findFirst({
            where: (fields, operators) => operators.eq(fields.id, params.id),
        });

        if (!selectedUser) {
            return c.json<ApiError>({ code: "DATABASE" }, 400);
        }

        const isAuthorized =
            (user.role === "member" && user.id === params.id) ||
            (user.role === "creator" && user.id === params.id) ||
            (user.role === "admin" &&
                selectedUser.schoolId === user.schoolId) ||
            user.role === "systemadmin";
        if (!isAuthorized) {
            return c.json<ApiError>({ code: "AUTHORIZATION" }, 401);
        }

        const deletedUsers = await db
            .delete(userTable)
            .where(eq(userTable.id, params.id))
            .returning();

        if (deletedUsers.length === 0) {
            return c.json<ApiError>({ code: "DATABASE" }, 500);
        }

        return c.json<ApiResponse>({ data: deletedUsers[0] });
    },
);
