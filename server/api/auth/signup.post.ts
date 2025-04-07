import { eq } from "drizzle-orm";
import { handleAsync } from "~/server/utils/handle-async";
import {
  ErrorInvalidAuthId,
  ErrorUnknownDatabase,
  ErrorValidation,
} from "~/utils/error-status";
import { signupSchema, type User } from "~/utils/models";

export default defineEventHandler(async (event) => {
  const bodyValidationResult = await readValidatedBody(
    event,
    signupSchema.safeParse,
  );

  if (!bodyValidationResult.success) {
    throw createError({
      statusCode: 400,
      statusText: ErrorValidation,
      data: bodyValidationResult.error.flatten().fieldErrors,
    });
  }

  const signupData = bodyValidationResult.data;
  const authIdResult = await handleAsync(() =>
    useDatabase().query.authIds.findFirst({
      where: (fields, ops) => ops.eq(fields.id, signupData.authId),
    }),
  );

  if (!authIdResult.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
      data: authIdResult.error,
    });
  }

  const authId = authIdResult.data;
  if (!authId) {
    throw createError({
      statusCode: 400,
      statusText: ErrorInvalidAuthId,
      data: authIdResult.error,
    });
  }

  if (authId.userId) {
    throw createError({
      statusCode: 400,
      statusText: ErrorInvalidAuthId,
    });
  }

  const hashedPassword = await hashPassword(signupData.password);
  const usersResult = await handleAsync(() =>
    useDatabase()
      .insert(tables.users)
      .values({
        email: signupData.email,
        name: signupData.name,
        permissions: "role-user",
        passwordHash: hashedPassword,
      })
      .returning(),
  );

  if (!usersResult.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
      data: usersResult.error,
    });
  }

  if (usersResult.data.length !== 1) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
    });
  }

  const serverUser = usersResult.data[0];

  const authIdUpdateResult = await handleAsync(() =>
    useDatabase()
      .update(tables.authIds)
      .set({ userId: serverUser.id })
      .where(eq(tables.authIds.id, authId.id)),
  );

  if (!authIdUpdateResult.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
      data: authIdUpdateResult.error,
    });
  }

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
