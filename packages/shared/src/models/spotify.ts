import { spotifyTokenTable } from "../schemas";

export type CreateSpotifyToken = typeof spotifyTokenTable.$inferInsert;
export type SpotifyToken = typeof spotifyTokenTable.$inferSelect;
