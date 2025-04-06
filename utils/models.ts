import { z } from "zod";

// Base schemas for common fields
export const timestampSchema = {
  createdAt: z.number(),
  updatedAt: z.number(),
};

export const permissionsSchema = z.enum(["role-admin", "role-user"]);

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

// Auth schemas
export const signupSchema = z.object({
  email: z
    .string()
    .email("Nieprawidłowy format adresu email")
    .min(1, "Email jest wymagany"),
  name: z
    .string()
    .min(2, "Imię musi mieć co najmniej 2 znaki")
    .max(50, "Imię nie może być dłuższe niż 50 znaków"),
  password: z
    .string()
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .max(50, "Hasło nie może być dłuższe niż 50 znaków"),
  authId: z
    .string()
    .min(1, "ID autoryzacji jest wymagane")
    .max(50, "ID autoryzacji nie może być dłuższe niż 50 znaków"),
});

export const signinSchema = z.object({
  email: z
    .string()
    .email("Nieprawidłowy format adresu email")
    .min(1, "Email jest wymagany"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

export const signoutSchema = z.object({});

// User schemas
export const serverUserSchema = z.object({
  id: z.number(),
  email: z.string().email("Nieprawidłowy format adresu email"),
  name: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
  passwordHash: z.string(),
  permissions: z.string(),
  ...timestampSchema,
});

export const userSchema = serverUserSchema.omit({ passwordHash: true });

export const createUserSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu email"),
  name: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
  passwordHash: z.string(),
  permissions: z.string(),
});

export const updateUserSchema = z.object({
  email: z.string().email("Nieprawidłowy format adresu email").optional(),
  name: z.string().min(2, "Imię musi mieć co najmniej 2 znaki").optional(),
  passwordHash: z.string().optional(),
  permissions: z.string().optional(),
});

// Spotify Token schemas
export const spotifyTokenSchema = z.object({
  id: z.number(),
  userId: z.number(),
  accessToken: z.string().min(1, "Token dostępu jest wymagany"),
  refreshToken: z.string().min(1, "Token odświeżania jest wymagany"),
  active: z.union([z.literal(0), z.literal(1)]),
  ...timestampSchema,
});

export const createSpotifyTokenSchema = z.object({
  userId: z.number().min(1, "ID użytkownika jest wymagane"),
  accessToken: z.string().min(1, "Token dostępu jest wymagany"),
  refreshToken: z.string().min(1, "Token odświeżania jest wymagany"),
  active: z.union([z.literal(0), z.literal(1)]),
});

export const updateSpotifyTokenSchema = z.object({
  accessToken: z.string().min(1, "Token dostępu jest wymagany").optional(),
  refreshToken: z.string().min(1, "Token odświeżania jest wymagany").optional(),
  active: z.union([z.literal(0), z.literal(1)]).optional(),
});

// Track History schemas
export const trackHistorySchema = z.object({
  id: z.number(),
  trackId: z.string().min(1, "ID utworu jest wymagane"),
  startedAt: z.number(),
  endedAt: z.number(),
  ...timestampSchema,
});

export const createTrackHistorySchema = z.object({
  trackId: z.string().min(1, "ID utworu jest wymagane"),
});

export const updateTrackHistorySchema = z.object({
  trackId: z.string().min(1, "ID utworu jest wymagane").optional(),
});

// Vote Rounds schemas
export const voteRoundSchema = z.object({
  id: z.number(),
  startedAt: z.number(),
  endedAt: z.number(),
  ...timestampSchema,
});

export const createVoteRoundSchema = z.object({});

export const updateVoteRoundSchema = z.object({});

// Votes schemas
export const voteSchema = z.object({
  id: z.number(),
  roundId: z.number().min(1, "ID rundy jest wymagane"),
  userId: z.number().min(1, "ID użytkownika jest wymagane"),
  trackId: z.string().min(1, "ID utworu jest wymagane"),
  count: z.number().min(0, "Liczba głosów musi być dodatnia"),
  ...timestampSchema,
});

export const createVoteSchema = z.object({
  roundId: z.number().min(1, "ID rundy jest wymagane"),
  userId: z.number().min(1, "ID użytkownika jest wymagane"),
  trackId: z.string().min(1, "ID utworu jest wymagane"),
  count: z.number().min(0, "Liczba głosów musi być dodatnia"),
});

export const updateVoteSchema = z.object({
  roundId: z.number().min(1, "ID rundy jest wymagane").optional(),
  userId: z.number().min(1, "ID użytkownika jest wymagane").optional(),
  trackId: z.string().min(1, "ID utworu jest wymagane").optional(),
  count: z.number().min(0, "Liczba głosów musi być dodatnia").optional(),
});

// Types exports
export type Permissions = z.infer<typeof permissionsSchema>;
export type Pagination = z.infer<typeof paginationSchema>;

export type SigninData = z.infer<typeof signinSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type SignoutData = z.infer<typeof signoutSchema>;

export type ServerUser = z.infer<typeof serverUserSchema>;
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type SpotifyToken = z.infer<typeof spotifyTokenSchema>;
export type CreateSpotifyToken = z.infer<typeof createSpotifyTokenSchema>;
export type UpdateSpotifyToken = z.infer<typeof updateSpotifyTokenSchema>;

export type TrackHistory = z.infer<typeof trackHistorySchema>;
export type CreateTrackHistory = z.infer<typeof createTrackHistorySchema>;
export type UpdateTrackHistory = z.infer<typeof updateTrackHistorySchema>;

export type VoteRound = z.infer<typeof voteRoundSchema>;
export type CreateVoteRound = z.infer<typeof createVoteRoundSchema>;
export type UpdateVoteRound = z.infer<typeof updateVoteRoundSchema>;

export type Vote = z.infer<typeof voteSchema>;
export type CreateVote = z.infer<typeof createVoteSchema>;
export type UpdateVote = z.infer<typeof updateVoteSchema>;
