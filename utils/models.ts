import { z } from "zod";

// Base schemas for common fields
export const timestampSchema = {
  createdAt: z.number({ message: "Wymagane" }),
  updatedAt: z.number({ message: "Wymagane" }),
};

export const permissionsSchema = z.enum(["role-admin", "role-user"]);

export const paginationSchema = z.object({
  offset: z.number({ message: "Wymagane", coerce: true }).min(0).default(0),
  limit: z
    .number({ message: "Wymagane", coerce: true })
    .min(1)
    .max(100)
    .default(10),
});

// Auth schemas

export const authIdSchema = z.object({
  id: z
    .string({ message: "Wymagane" })
    .min(1, "ID jest wymagane")
    .max(255, "ID nie może być dłuższe niż 255 znaków"),
  userId: z.number({ message: "Wymagane" }).nullish(),
  expiresAt: z.number({ message: "Wymagane" }),
  ...timestampSchema,
});

export const createAuthIdSchema = z.object({
  id: z
    .string({ message: "Wymagane" })
    .min(1, "ID jest wymagane")
    .max(255, "ID nie może być dłuższe niż 255 znaków"),
});

export const updateAuthIdSchema = z.object({
  userId: z.number({ message: "Wymagane" }).optional(),
  expiresAt: z.number({ message: "Wymagane" }).optional(),
});

export const signupSchema = z.object({
  email: z
    .string({ message: "Wymagane" })
    .email("Nieprawidłowy format adresu email")
    .min(1, "Email jest wymagany"),
  name: z
    .string({ message: "Wymagane" })
    .min(2, "Imię musi mieć co najmniej 2 znaki")
    .max(50, "Imię nie może być dłuższe niż 50 znaków"),
  password: z
    .string({ message: "Wymagane" })
    .min(6, "Hasło musi mieć co najmniej 6 znaków")
    .max(50, "Hasło nie może być dłuższe niż 50 znaków"),
  authId: z
    .string({ message: "Wymagane" })
    .min(1, "ID autoryzacji jest wymagane")
    .max(50, "ID autoryzacji nie może być dłuższe niż 50 znaków"),
});

export const signinSchema = z.object({
  email: z
    .string({ message: "Wymagane" })
    .email("Nieprawidłowy format adresu email")
    .min(1, "Email jest wymagany"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

export const signoutSchema = z.object({});

// User schemas
export const serverUserSchema = z.object({
  id: z.number({ message: "Wymagane" }),
  email: z
    .string({ message: "Wymagane" })
    .email("Nieprawidłowy format adresu email"),
  name: z
    .string({ message: "Wymagane" })
    .min(2, "Imię musi mieć co najmniej 2 znaki"),
  passwordHash: z.string({ message: "Wymagane" }),
  permissions: z.string({ message: "Wymagane" }),
  ...timestampSchema,
});

export const userSchema = serverUserSchema.omit({ passwordHash: true });

export const createUserSchema = z.object({
  email: z
    .string({ message: "Wymagane" })
    .email("Nieprawidłowy format adresu email"),
  name: z
    .string({ message: "Wymagane" })
    .min(2, "Imię musi mieć co najmniej 2 znaki"),
  passwordHash: z.string({ message: "Wymagane" }),
  permissions: z.string({ message: "Wymagane" }),
});

export const updateUserSchema = z.object({
  email: z
    .string({ message: "Wymagane" })
    .email("Nieprawidłowy format adresu email")
    .optional(),
  name: z
    .string({ message: "Wymagane" })
    .min(2, "Imię musi mieć co najmniej 2 znaki")
    .optional(),
  passwordHash: z.string({ message: "Wymagane" }).optional(),
  permissions: z.string({ message: "Wymagane" }).optional(),
});

// Spotify Token schemas
export const spotifyTokenSchema = z.object({
  id: z.number({ message: "Wymagane" }),
  userId: z.number({ message: "Wymagane" }),
  accessToken: z
    .string({ message: "Wymagane" })
    .min(1, "Token dostępu jest wymagany"),
  refreshToken: z
    .string({ message: "Wymagane" })
    .min(1, "Token odświeżania jest wymagany"),
  active: z.union([z.literal(0), z.literal(1)]),
  ...timestampSchema,
});

export const createSpotifyTokenSchema = z.object({
  userId: z
    .number({ message: "Wymagane" })
    .min(1, "ID użytkownika jest wymagane"),
  accessToken: z
    .string({ message: "Wymagane" })
    .min(1, "Token dostępu jest wymagany"),
  refreshToken: z
    .string({ message: "Wymagane" })
    .min(1, "Token odświeżania jest wymagany"),
  active: z.union([z.literal(0), z.literal(1)]),
});

export const updateSpotifyTokenSchema = z.object({
  accessToken: z
    .string({ message: "Wymagane" })
    .min(1, "Token dostępu jest wymagany")
    .optional(),
  refreshToken: z
    .string({ message: "Wymagane" })
    .min(1, "Token odświeżania jest wymagany")
    .optional(),
  active: z.union([z.literal(0), z.literal(1)]).optional(),
});

// Track History schemas
export const trackHistorySchema = z.object({
  id: z.number({ message: "Wymagane" }),
  trackId: z.string({ message: "Wymagane" }).min(1, "ID utworu jest wymagane"),
  startedAt: z.number({ message: "Wymagane" }),
  endedAt: z.number({ message: "Wymagane" }),
  ...timestampSchema,
});

export const createTrackHistorySchema = z.object({
  trackId: z.string({ message: "Wymagane" }).min(1, "ID utworu jest wymagane"),
});

export const updateTrackHistorySchema = z.object({
  trackId: z
    .string({ message: "Wymagane" })
    .min(1, "ID utworu jest wymagane")
    .optional(),
});

// Vote Rounds schemas
export const voteRoundSchema = z.object({
  id: z.number({ message: "Wymagane" }),
  startedAt: z.number({ message: "Wymagane" }),
  endedAt: z.number({ message: "Wymagane" }),
  ...timestampSchema,
});

export const createVoteRoundSchema = z.object({});

export const updateVoteRoundSchema = z.object({});

// Votes schemas
export const voteSchema = z.object({
  id: z.number({ message: "Wymagane" }),
  roundId: z.number({ message: "Wymagane" }).min(1, "ID rundy jest wymagane"),
  userId: z
    .number({ message: "Wymagane" })
    .min(1, "ID użytkownika jest wymagane"),
  trackId: z.string({ message: "Wymagane" }).min(1, "ID utworu jest wymagane"),
  count: z
    .number({ message: "Wymagane" })
    .min(0, "Liczba głosów musi być dodatnia"),
  ...timestampSchema,
});

export const createVoteSchema = z.object({
  roundId: z.number({ message: "Wymagane" }).min(1, "ID rundy jest wymagane"),
  userId: z
    .number({ message: "Wymagane" })
    .min(1, "ID użytkownika jest wymagane"),
  trackId: z.string({ message: "Wymagane" }).min(1, "ID utworu jest wymagane"),
  count: z
    .number({ message: "Wymagane" })
    .min(0, "Liczba głosów musi być dodatnia"),
});

export const updateVoteSchema = z.object({
  roundId: z
    .number({ message: "Wymagane" })
    .min(1, "ID rundy jest wymagane")
    .optional(),
  userId: z
    .number({ message: "Wymagane" })
    .min(1, "ID użytkownika jest wymagane")
    .optional(),
  trackId: z
    .string({ message: "Wymagane" })
    .min(1, "ID utworu jest wymagane")
    .optional(),
  count: z
    .number({ message: "Wymagane" })
    .min(0, "Liczba głosów musi być dodatnia")
    .optional(),
});

// Types exports
export type Permissions = z.infer<typeof permissionsSchema>;
export type Pagination = z.infer<typeof paginationSchema>;

export type AuthId = z.infer<typeof authIdSchema>;
export type CreateAuthId = z.infer<typeof createAuthIdSchema>;
export type UpdateAuthId = z.infer<typeof updateAuthIdSchema>;

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
