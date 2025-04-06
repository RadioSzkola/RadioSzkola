import { count } from "drizzle-orm";
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
    });
  }

  const { page, limit } = paginationResult.data;
  const offset = (page - 1) * limit;

  const countResult = await handleAsync(() =>
    useDatabase().select({ value: count() }).from(tables.authIds),
  );

  if (!countResult.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
    });
  }

  const rowCount = countResult.data[0].value;

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

  return {
    items: authIdsResult.data,
    pagination: {
      page,
      limit,
      total: countResult.data,
      pages: Math.ceil(rowCount / limit),
    },
  };
});
