import { z } from "zod";
import { spotifyTokenTable } from "../schemas";

export const spotifyAdminInitSchema = z.object({
    tokenId: z.number(),
});

export type CreateSpotifyToken = typeof spotifyTokenTable.$inferInsert;
export type SpotifyToken = typeof spotifyTokenTable.$inferSelect;

export type SpotifyAdminInit = z.infer<typeof spotifyAdminInitSchema>;
