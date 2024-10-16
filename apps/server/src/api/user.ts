import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAllowedOrigins } from "../const";
import { AppError } from "@rs/shared/error";
import { ServerResponse, updateUserSchema, User } from "@rs/shared/models";
import {
    bodyValidatorMiddleware,
    paginationValidatorMiddleware,
    paramsValidatorMiddleware,
} from "../middlewares/validation";
import { db } from "../db";
import { userTable } from "../schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { ApiContext } from "../context";
import { useAuthRules } from "../auth";

export const userRouterV1 = new Hono<ApiContext>();

userRouterV1.use(
    cors({
        origin: getAllowedOrigins(),
        allowMethods: ["GET", "PATCH", "DELETE"],
    }),
);

userRouterV1.get("/", paginationValidatorMiddleware, async c => {
    const { limit, offset } = c.req.valid("query");

    const { user, error, statusCode } = useAuthRules(c, {
        admin: true,
        systemadmin: true,
    });

    if (error) return c.json(error, statusCode);

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

    return c.json<ServerResponse>({ data: users });
});

userRouterV1.get(
    "/:id",
    paramsValidatorMiddleware(z.object({ id: z.string() })),
    async c => {
        const params = c.req.valid("param");

        const selectedUser = await db.query.userTable.findFirst({
            where: (fields, operators) => operators.eq(fields.id, params.id),
        });

        if (!selectedUser) return c.json<AppError>({ code: "DATABASE" }, 404);

        const { error, statusCode } = useAuthRules(c, {
            member: user => user.id === selectedUser.id,
            creator: user => user.id === selectedUser.id,
            admin: user => user.schoolId === selectedUser.schoolId,
            systemadmin: true,
        });

        if (error) return c.json(error, statusCode);

        return c.json<ServerResponse>({ data: selectedUser });
    },
);

userRouterV1.patch(
    "/:id",
    bodyValidatorMiddleware(updateUserSchema),
    paramsValidatorMiddleware(z.object({ id: z.string() })),
    async c => {
        const updateUserData = c.req.valid("json");
        const params = c.req.valid("param");

        const selectedUser = await db.query.userTable.findFirst({
            where: (fields, operators) => operators.eq(fields.id, params.id),
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
            .where(eq(userTable.id, params.id))
            .returning();

        if (updatedUsers.length === 0)
            return c.json<AppError>({ code: "DATABASE" }, 400);

        return c.json<ServerResponse>({ data: updatedUsers[0] });
    },
);

userRouterV1.delete(
    "/:id",
    paramsValidatorMiddleware(z.object({ id: z.string() })),
    async c => {
        const params = c.req.valid("param");

        const selectedUser = await db.query.userTable.findFirst({
            where: (fields, operators) => operators.eq(fields.id, params.id),
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
            .where(eq(userTable.id, params.id))
            .returning();

        if (deletedUsers.length === 0)
            return c.json<AppError>({ code: "DATABASE" }, 500);

        return c.json<ServerResponse>({ data: deletedUsers[0] });
    },
);
