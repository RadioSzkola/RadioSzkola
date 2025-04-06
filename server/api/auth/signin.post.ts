import { handleAsync } from "~/server/utils/handle-async";
import {
  ErrorNotFound,
  ErrorUnknownDatabase,
  ErrorUserInvalidCredentials,
  ErrorValidation,
} from "~/utils/error-status";
import { signinSchema } from "~/utils/models";

export default defineEventHandler(async (event) => {
  const bodyValidationResult = await readValidatedBody(
    event,
    signinSchema.safeParse,
  );

  if (!bodyValidationResult.success) {
    throw createError({
      statusCode: 400,
      statusText: ErrorValidation,
      data: bodyValidationResult.error.flatten().fieldErrors,
    });
  }

  const signinData = bodyValidationResult.data;
  const userResult = await handleAsync(() =>
    useDatabase().query.users.findFirst({
      where: (fields, ops) => ops.eq(fields.email, signinData.email),
    }),
  );

  if (!userResult.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
    });
  }

  const serverUser = userResult.data;
  if (!serverUser) {
    throw createError({
      statusCode: 404,
      statusText: ErrorNotFound,
    });
  }

  const valid = await verifyPassword(
    serverUser.passwordHash,
    signinData.password,
  );
  if (!valid) {
    throw createError({
      statusCode: 400,
      statusText: ErrorUserInvalidCredentials,
    });
  }

  const user = {
    id: serverUser.id,
    email: serverUser.email,
    name: serverUser.name,
    permissions: serverUser.permissions,
    createdAt: serverUser.createdAt,
    updatedAt: serverUser.updatedAt,
  };

  await replaceUserSession(event, {
    user,
  });

  return user;
});
