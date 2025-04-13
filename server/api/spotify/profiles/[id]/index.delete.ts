import { eq } from "drizzle-orm";
import { ErrorNotFound, ErrorValidation } from "~/utils/error-status";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusText: ErrorValidation,
    });
  }

  const profiles = await useDatabase()
    .delete(tables.spotifyProfiles)
    .where(eq(tables.spotifyProfiles.id, parseInt(id)))
    .returning();

  if (!profiles.length) {
    throw createError({
      statusCode: 404,
      statusText: ErrorNotFound,
    });
  }

  return profiles[0];
});
