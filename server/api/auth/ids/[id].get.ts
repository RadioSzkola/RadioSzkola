import { handleAsync } from "~/server/utils/handle-async";
import {
  ErrorAuthIdNotFound,
  ErrorUnknownDatabase,
} from "~/utils/error-status";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusText: "Missing ID parameter",
    });
  }

  const result = await handleAsync(() =>
    useDatabase().query.authIds.findFirst({
      where: (fields, ops) => ops.eq(fields.id, id),
    }),
  );

  if (!result.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
    });
  }

  const authId = result.data;
  if (!authId) {
    throw createError({
      statusCode: 404,
      statusText: ErrorAuthIdNotFound,
    });
  }

  return authId;
});
