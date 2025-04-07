import { handleAsync } from "~/server/utils/handle-async";
import {
  ErrorInvalidPagination,
  ErrorUnknownDatabase,
} from "~/utils/error-status";
import { paginationSchema } from "~/utils/models";

export default defineEventHandler(async (event) => {
  const paginationResult = await getValidatedQuery(
    event,
    paginationSchema.safeParse,
  );

  if (!paginationResult.success) {
    throw createError({
      statusCode: 400,
      statusText: ErrorInvalidPagination,
      data: paginationResult.error.flatten().fieldErrors,
    });
  }

  const { offset, limit } = paginationResult.data;

  const authIdsResult = await handleAsync(() =>
    useDatabase().query.authIds.findMany({
      limit,
      offset,
      orderBy: (fields, { desc }) => [desc(fields.createdAt)],
    }),
  );

  if (!authIdsResult.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
    });
  }

  return authIdsResult.data;
});
