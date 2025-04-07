import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamp = {
  createdAt: integer()
    .$defaultFn(() => new Date().getTime())
    .notNull(),
  updatedAt: integer()
    .$defaultFn(() => new Date().getTime())
    .$onUpdateFn(() => new Date().getTime())
    .notNull(),
};

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("passwordHash").notNull(),
  permissions: text("permissions").notNull(),
  ...timestamp,
});

export const authIds = sqliteTable("authIds", {
  id: text("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  expiresAt: integer("expiresAt").notNull(),
  ...timestamp,
});

export const spotifyProfiles = sqliteTable("spotifyProfiles", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  spotifyUsername: text("spotifyUsername").notNull(),
  spotifyId: text("spotifyId").notNull().unique(),
  accessToken: text("accessToken").notNull(),
  refreshToken: text("refreshToken").notNull(),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt").notNull(),
  active: integer("active").notNull().default(0).$type<0 | 1>(),
  ...timestamp,
});

export const trackHistory = sqliteTable("trackHistory", {
  id: integer("id").primaryKey(),
  trackId: text("trackId").notNull(),
  startedAt: integer("startedAt").notNull(),
  endedAt: integer("endedAt").notNull(),
  profile: integer("profile")
    .notNull()
    .references(() => spotifyProfiles.id),
  ...timestamp,
});

export const voteRounds = sqliteTable("voteRounds", {
  id: integer("id").primaryKey(),
  startedAt: integer("startedAt").notNull(),
  endedAt: integer("endedAt").notNull(),
  ...timestamp,
});

export const votes = sqliteTable("votes", {
  id: integer("id").primaryKey(),
  roundId: integer("roundId")
    .notNull()
    .references(() => voteRounds.id),
  userId: integer("userId")
    .notNull()
    .references(() => users.id),
  trackId: text("trackId").notNull(),
  count: integer("count").notNull(),
  ...timestamp,
});

export const usersRelations = relations(users, ({ many, one }) => ({
  trackHistory: many(trackHistory),
  votes: many(votes),
  authId: one(authIds, {
    fields: [users.id],
    references: [authIds.id],
  }),
}));

export const authIdsRelations = relations(authIds, ({ one }) => ({
  user: one(users, {
    fields: [authIds.id],
    references: [users.id],
  }),
}));

export const spotifyProfilesRelations = relations(
  spotifyProfiles,
  ({ many }) => ({
    tracks: many(trackHistory),
  }),
);

export const trackHistoryRelations = relations(trackHistory, ({ one }) => ({
  profile: one(spotifyProfiles, {
    fields: [trackHistory.profile],
    references: [spotifyProfiles.id],
  }),
}));

export const voteRoundsRelations = relations(voteRounds, ({ many }) => ({
  votes: many(votes),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
  voteRound: one(voteRounds, {
    fields: [votes.roundId],
    references: [voteRounds.id],
  }),
}));
