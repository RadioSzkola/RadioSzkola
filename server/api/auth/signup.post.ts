import { eq } from "drizzle-orm";
import { handleAsync } from "~/server/utils/handle-async";
import {
  ErrorInvalidAuthId,
  ErrorUnknownDatabase,
  ErrorValidation,
} from "~/utils/error-status";
import { signupSchema, type User } from "~/utils/models";

export default defineEventHandler(async (event) => {
  const { success, data, error } = await readValidatedBody(
    event,
    signupSchema.safeParse,
  );

  if (!success) {
    throw createError({
      statusCode: 400,
      statusText: ErrorValidation,
      data: error.flatten().fieldErrors,
    });
  }

  const authIdResult = await handleAsync(() =>
    useDatabase().query.authIds.findFirst({
      where: (fields, ops) => ops.eq(fields.id, data.authId),
    }),
  );

  if (!authIdResult.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
    });
  }

  const authId = authIdResult.data;
  if (!authId) {
    throw createError({
      statusCode: 400,
      statusText: ErrorInvalidAuthId,
    });
  }

  if (authId.userId) {
    throw createError({
      statusCode: 400,
      statusText: ErrorInvalidAuthId,
    });
  }

  const hashedPassword = await hashPassword(data.password);
  const usersResult = await handleAsync(() =>
    useDatabase().transaction(async (tx) => {
      const user = await tx
        .insert(tables.users)
        .values({
          email: data.email,
          name: data.name,
          permissions: "role-user",
          passwordHash: hashedPassword,
        })
        .returning();

      await tx
        .update(tables.authIds)
        .set({ userId: user[0].id })
        .where(eq(tables.authIds.id, authId.id));

      return user;
    }),
  );

  if (!usersResult.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
    });
  }

  if (usersResult.data.length !== 1) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
    });
  }

  const serverUser = usersResult.data[0];
  const user = {
    id: serverUser.id,
    email: serverUser.email,
    name: serverUser.name,
    permissions: serverUser.permissions,
    updatedAt: serverUser.updatedAt,
    createdAt: serverUser.createdAt,
  } as User;

  await replaceUserSession(event, { user });

  return user;
});
