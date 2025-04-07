import { eq } from "drizzle-orm";
import { defineEventHandler, getCookie } from "h3";
import { ErrorUnknownDatabase } from "~/utils/error-status";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const query = getQuery(event);
  const state = query.state as string;
  const code = query.code as string;
  const error = query.error as string;

  const storedState = getCookie(event, "spotify_auth_state");
  if (state !== storedState) {
    throw createError({
      statusCode: 400,
      statusMessage: "State mismatch",
    });
  }

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: `Spotify authorization error: ${error}`,
    });
  }

  const clientId = config.public.spotifyClientId;
  const clientSecret = config.spotifyClientSecret;
  const redirectUri = config.spotifyRedirectUri;

  const tokenResult = await handleAsync<SpotifyTokenResponse, Error>(() =>
    $fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`,
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    }),
  );

  if (!tokenResult.success) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to exchange authorization code for tokens",
      data: tokenResult.error,
    });
  }

  const userProfileResult = await handleAsync<
    {
      id: string;
      display_name: string | null;
      external_urls: {
        spotify: string;
      };
      uri: string;
    },
    unknown
  >(() =>
    $fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenResult.data.access_token}`,
      },
    }),
  );

  if (!userProfileResult.success) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch user profile",
      data: userProfileResult.error,
    });
  }

  const deactivateResult = await handleAsync(() =>
    useDatabase()
      .update(tables.spotifyProfiles)
      .set({ active: 0 })
      .where(eq(tables.spotifyProfiles.active, 1)),
  );

  if (!deactivateResult.success) {
    throw createError({
      statusCode: 500,
      statusMessage: ErrorUnknownDatabase,
      data: deactivateResult.error,
    });
  }

  const profileResult = await handleAsync(() =>
    useDatabase()
      .insert(tables.spotifyProfiles)
      // @ts-expect-error I dont know what to do here
      .values({
        name: userProfileResult.data?.display_name || "ERROR",
        spotifyId: userProfileResult.data?.id || "ERROR",
        spotifyUsername: userProfileResult.data?.display_name || "ERROR",
        accessToken: tokenResult.data.access_token,
        refreshToken: tokenResult.data.refresh_token,
        refreshTokenExpiresAt: Date.now() + tokenResult.data.expires_in * 1000,
        active: 1,
      })
      .returning(),
  );

  if (!profileResult.success) {
    throw createError({
      statusCode: 500,
      statusMessage: ErrorUnknownDatabase,
      data: profileResult.error,
    });
  }

  if (!profileResult.data || profileResult.data.length === 0) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create Spotify profile",
    });
  }

  await sendRedirect(event, "/admin");
});
