import { eq } from "drizzle-orm";
import { ErrorUnknownDatabase, ErrorValidation } from "~/utils/error-status";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusText: ErrorValidation,
    });
  }

  const result = await handleAsync(() =>
    useDatabase()
      .delete(tables.spotifyProfiles)
      .where(eq(tables.spotifyProfiles.id, parseInt(id)))
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
