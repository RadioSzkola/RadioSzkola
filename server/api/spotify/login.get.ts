import { defineEventHandler, sendRedirect, setCookie } from "h3";
import { randomBytes } from "crypto";

const SPOTIFY_AUTHORIZE_URL = "https://accounts.spotify.com/authorize";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const clientId = config.public.spotifyClientId;
  const redirectUri = config.spotifyRedirectUri;

  if (!clientId || !redirectUri) {
    throw createError({
      statusCode: 500,
      statusMessage:
        "Spotify configuration (Client ID or Redirect URI) missing.",
    });
  }

  const scope = [
    "user-read-private",
    "user-read-email",
    "user-read-currently-playing",
    "user-read-playback-state",
  ].join(" ");

  const state = randomBytes(16).toString("hex");

  setCookie(event, "spotify_auth_state", state, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 15,
    sameSite: "lax",
  });
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    state: state,
  });

  const authUrl = `${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`;
  await sendRedirect(event, authUrl, 302);
});
