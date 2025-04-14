import { z } from "zod";
import { handleAsync } from "~/server/utils/handle-async";
import { ErrorUnknownDatabase, ErrorValidation } from "~/utils/error-status";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (user.permissions !== "role-admin") {
    throw createError({
      statusCode: 403,
    });
  }

  const bodyValidationResult = await readValidatedBody(
    event,
    z.object({ id: z.string().min(1).max(255) }).safeParse,
  );

  if (!bodyValidationResult.success) {
    throw createError({
      statusCode: 400,
      statusText: ErrorValidation,
    });
  }

  const { id } = bodyValidationResult.data;

  // Insert the new auth ID into the database
  const result = await handleAsync(() =>
    useDatabase()
      .insert(tables.authIds)
      .values({
        id,
        expiresAt: Date.now() + 14 * 24 * 60 * 60 * 1000, // Expires in 14 days
      })
      .returning(),
  );

  if (!result.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
    });
  }

  return result.data[0];
});
