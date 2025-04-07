import type { H3Event } from "h3";
import type { NitroFetchOptions } from "nitropack";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

export type SpotifyTokenResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number; // Seconds
  refresh_token?: string; // Spotify might issue a new refresh token
};

export async function refreshSpotifyToken(event: H3Event): Promise<string> {
  const config = useRuntimeConfig(event);
  const spotifyProfile = await useDatabase().query.spotifyProfiles.findFirst({
    where: (fields, ops) => ops.eq(fields.active, 1),
  });

  if (!spotifyProfile) {
    throw createError({
      statusCode: 404,
      statusMessage: "Spotify profile not found.",
    });
  }

  const refreshToken = spotifyProfile.refreshToken;
  const clientId = config.public.spotifyClientId;
  const clientSecret = config.spotifyClientSecret;

  if (!clientId || !clientSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: "Spotify Client ID or Secret not configured.",
    });
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  const response = await $fetch<SpotifyTokenResponse>(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const newAccessToken = response.access_token;
  const newExpiresAt = Date.now() + response.expires_in * 1000;
  const newRefreshToken = response.refresh_token || refreshToken;

  await useDatabase().update(tables.spotifyProfiles).set({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    refreshTokenExpiresAt: newExpiresAt,
  });

  return newAccessToken;
}

export async function getValidAccessToken(event: H3Event): Promise<string> {
  const spotifyProfile = await useDatabase().query.spotifyProfiles.findFirst({
    where: (fields, ops) => ops.eq(fields.active, 1),
  });

  if (!spotifyProfile) {
    throw createError({
      statusCode: 404,
      statusMessage: "Spotify profile not found.",
    });
  }

  const accessToken = spotifyProfile.accessToken;
  const refreshToken = spotifyProfile.refreshToken;
  const refreshTokenExpiresAt = spotifyProfile.refreshTokenExpiresAt;

  if (!accessToken || !refreshToken || !refreshTokenExpiresAt) {
    throw createError({
      statusCode: 500,
      statusMessage: "Spotify access token not found.",
    });
  }

  if (Date.now() > refreshTokenExpiresAt) {
    return refreshSpotifyToken(event);
  }

  return accessToken;
}

export async function fetchSpotifyAPI<T>(
  event: H3Event,
  endpoint: string,
  // @ts-expect-error I dont know what to do here
  options?: NitroFetchOptions,
): Promise<T> {
  const accessToken = await getValidAccessToken(event);

  const response = await $fetch<T>(SPOTIFY_API_BASE + endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // @ts-expect-error I dont know what to do here
  return response;
}
