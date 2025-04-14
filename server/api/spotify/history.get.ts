import type { SpotifyNowPlaying } from "~/types/spotify";
import { ErrorUnknownDatabase } from "~/utils/error-status";

export default defineEventHandler(async (event) => {
  try {
    // Get the active Spotify profile
    const profileResult = await handleAsync(() =>
      useDatabase().query.spotifyProfiles.findFirst({
        where: (fields, ops) => ops.eq(fields.active, 1),
      }),
    );

    if (!profileResult.success) {
      throw createError({
        statusCode: 404,
        message: "No active Spotify profile found",
      });
    }

    const profile = profileResult.data;
    if (!profile) {
      throw createError({
        statusCode: 404,
        message: "No active Spotify profile found",
      });
    }

    // Get the 10 most recent tracks
    const tracksResult = await handleAsync(() =>
      useDatabase().query.trackHistory.findMany({
        orderBy: (fields, { desc }) => [desc(fields.startedAt)],
        limit: 10,
        where: (fields, ops) => ops.eq(fields.profile, profile.id),
      }),
    );

    if (!tracksResult.success) {
      throw createError({
        statusCode: 500,
        statusText: ErrorUnknownDatabase,
        message: "Failed to fetch track history",
      });
    }

    const trackHistory = tracksResult.data;

    // For each track in the history, get its details from Spotify
    const trackDetails = await Promise.all(
      trackHistory.map(async (historyItem) => {
        try {
          const trackData = (await fetchSpotifyAPI(
            event,
            `/tracks/${historyItem.trackId}`,
          )) as SpotifyNowPlaying["item"];

          if (!trackData) {
            throw createError({
              statusCode: 404,
              message: "Track not found",
            });
          }

          return {
            id: trackData.id,
            name: trackData.name,
            artists: trackData.artists.map((artist) => ({
              id: artist.id,
              name: artist.name,
            })),
            album: {
              id: trackData.album.id,
              name: trackData.album.name,
              images: trackData.album.images,
            },
            duration: trackData.duration_ms,
            startedAt: historyItem.startedAt,
            endedAt: historyItem.endedAt,
          };
        } catch (error) {
          console.error(
            `Failed to fetch details for track ${historyItem.trackId}:`,
            error,
          );
          // Return partial data if Spotify API call fails
          return {
            id: historyItem.trackId,
            name: "Unknown Track",
            artists: [{ id: "", name: "Unknown Artist" }],
            album: {
              id: "",
              name: "Unknown Album",
              images: [],
            },
            duration: 0,
            startedAt: historyItem.startedAt,
            endedAt: historyItem.endedAt,
          };
        }
      }),
    );

    return trackDetails;
  } catch (error) {
    console.error("Error in history.get.ts:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch track history",
    });
  }
});
