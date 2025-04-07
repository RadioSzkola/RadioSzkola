import { eq } from "drizzle-orm";
import { handleAsync } from "~/server/utils/handle-async";
import {
  ErrorNotFound,
  ErrorUnknownDatabase,
  ErrorValidation,
} from "~/utils/error-status";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusText: ErrorValidation,
      message: "Invalid profile ID",
    });
  }

  // First check if the profile exists
  const profileExists = await handleAsync(() =>
    useDatabase().query.spotifyProfiles.findFirst({
      where: (fields, ops) => ops.eq(fields.id, parseInt(id)),
    }),
  );

  if (!profileExists.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
    });
  }

  if (!profileExists.data) {
    throw createError({
      statusCode: 404,
      statusText: ErrorNotFound,
      message: "Spotify profile not found",
    });
  }

  // Deactivate all profiles first
  const deactivateResult = await handleAsync(() =>
    useDatabase()
      .update(tables.spotifyProfiles)
      .set({ active: 0 })
      .where(eq(tables.spotifyProfiles.active, 1)),
  );

  if (!deactivateResult.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
      message: "Failed to deactivate existing profiles",
    });
  }

  // Activate the specified profile
  const activateResult = await handleAsync(() =>
    useDatabase()
      .update(tables.spotifyProfiles)
      .set({ active: 1 })
      .where(eq(tables.spotifyProfiles.id, parseInt(id)))
      .returning(),
  );

  if (!activateResult.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
      message: "Failed to activate profile",
    });
  }

  return activateResult.data[0];
});
