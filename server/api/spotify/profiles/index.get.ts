import { ErrorUnknownDatabase } from "~/utils/error-status";

export default defineEventHandler(async () => {
  const result = await handleAsync(() =>
    useDatabase().query.spotifyProfiles.findMany({
      orderBy: (fields, { desc }) => [desc(fields.createdAt)],
    }),
  );

  if (!result.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
    });
  }

  return result.data;
});
