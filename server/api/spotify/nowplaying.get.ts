import { eq } from "drizzle-orm";
import type {
  SpotifyNowPlaying,
  SpotifyNowPlayingResponse,
} from "~/types/spotify";
import { ErrorNotFound, ErrorUnknownDatabase } from "~/utils/error-status";

export default defineEventHandler(async (event) => {
  const profileResult = await handleAsync(() =>
    useDatabase().query.spotifyProfiles.findFirst({
      where: (fields, ops) => ops.eq(fields.active, 1),
    }),
  );

  if (!profileResult.success) {
    throw createError({
      statusCode: 500,
      statusText: ErrorUnknownDatabase,
      message: "Failed to fetch active profile",
    });
  }

  if (!profileResult.data) {
    throw createError({
      statusCode: 404,
      statusText: ErrorNotFound,
      message: "No active Spotify profile found",
    });
  }

  const profile = profileResult.data;

  try {
    const currentlyPlaying = await fetchSpotifyAPI<SpotifyNowPlaying>(
      event,
      "/me/player",
    );

    if (!currentlyPlaying || !currentlyPlaying.item) {
      return {
        isPlaying: false,
        track: null,
      } as SpotifyNowPlayingResponse;
    }

    // If track is playing, store it in track history
    if (currentlyPlaying.is_playing) {
      const trackHistory = await useDatabase().query.trackHistory.findMany({
        orderBy: (fields, { desc }) => [desc(fields.startedAt)],
        limit: 1,
      });

      if (trackHistory.length === 0) {
        await useDatabase()
          .insert(tables.trackHistory)
          .values({
            trackId: currentlyPlaying.item.id,
            startedAt: Date.now(),
            endedAt:
              currentlyPlaying.timestamp -
              currentlyPlaying.progress_ms +
              currentlyPlaying.item.duration_ms,
            profile: profile.id,
          })
          .returning();
      } else {
        const lastTrack = trackHistory[0];

        if (lastTrack.trackId !== currentlyPlaying.item.id) {
          await useDatabase()
            .update(tables.trackHistory)
            .set({
              endedAt: Date.now(),
            })
            .where(eq(tables.trackHistory.id, lastTrack.id));

          await useDatabase()
            .insert(tables.trackHistory)
            .values({
              trackId: currentlyPlaying.item.id,
              startedAt: Date.now(),
              endedAt:
                currentlyPlaying.timestamp -
                currentlyPlaying.progress_ms +
                currentlyPlaying.item.duration_ms,
              profile: profile.id,
            });
        }
      }
    }

    // Format and return the response
    return {
      isPlaying: currentlyPlaying.is_playing,
      track: {
        id: currentlyPlaying.item.id,
        name: currentlyPlaying.item.name,
        artists: currentlyPlaying.item.artists.map(
          (artist: Record<string, unknown>) => ({
            id: artist.id,
            name: artist.name,
          }),
        ),
        album: {
          id: currentlyPlaying.item.album.id,
          name: currentlyPlaying.item.album.name,
          images: currentlyPlaying.item.album.images,
        },
        duration: currentlyPlaying.item.duration_ms,
        progress: currentlyPlaying.progress_ms,
        startedAt: currentlyPlaying.timestamp - currentlyPlaying.progress_ms,
      },
      profile: {
        id: profileResult.data.id,
        name: profileResult.data.name,
      },
    } as SpotifyNowPlayingResponse;
  } catch (error) {
    console.error("Spotify API Error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch currently playing track",
    });
  }
});
