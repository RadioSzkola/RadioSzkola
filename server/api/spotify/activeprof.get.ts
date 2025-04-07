import { ErrorUnknownDatabase, ErrorNotFound } from "~/utils/error-status";

export default defineEventHandler(async () => {
  const result = await handleAsync(() =>
    useDatabase().query.spotifyProfiles.findFirst({
      where: (fields, ops) => ops.eq(fields.active, 1),
    }),
  );

  if (!result.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
    });
  }

  if (!result.data) {
    throw createError({
      statusCode: 404,
      statusText: ErrorNotFound,
      message: "No active Spotify profile found",
    });
  }

  return result.data;
});
