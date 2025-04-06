import { randomBytes } from "crypto";
import { handleAsync } from "~/server/utils/handle-async";
import { ErrorUnknownDatabase } from "~/utils/error-status";

export default defineEventHandler(async () => {
  // Generate a random ID
  const id = randomBytes(16).toString("hex");

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
