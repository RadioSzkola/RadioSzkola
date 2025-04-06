import { eq } from "drizzle-orm";
import { handleAsync } from "~/server/utils/handle-async";
import {
  ErrorNotFound,
  ErrorUnknownDatabase,
  ErrorValidation,
  ErrorInvalidAuthId,
} from "~/utils/error-status";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusText: ErrorValidation,
    });
  }

  // First check if the auth ID exists
  const findResult = await handleAsync(() =>
    useDatabase().query.authIds.findFirst({
      where: (fields, ops) => ops.eq(fields.id, id),
    }),
  );

  if (!findResult.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
    });
  }

  const authId = findResult.data;
  if (!authId) {
    throw createError({
      statusCode: 404,
      statusText: ErrorNotFound,
    });
  }

  // Check if there's a user associated with this auth ID
  if (authId.userId) {
    throw createError({
      statusCode: 400,
      statusText: ErrorInvalidAuthId,
      message: "Cannot delete auth ID that is associated with a user",
    });
  }

  // Delete the auth ID
  const deleteResult = await handleAsync(() =>
    useDatabase()
      .delete(tables.authIds)
      .where(eq(tables.authIds.id, id))
      .returning(),
  );

  if (!deleteResult.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
    });
  }

  // Return the deleted auth ID
  return deleteResult.data[0];
});
