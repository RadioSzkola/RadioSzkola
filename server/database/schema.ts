import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamp = {
  createdAt: integer().$defaultFn(() => new Date().getTime()),
  updatedAt: integer().$defaultFn(() => new Date().getTime()),
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
  ...timestamp,
});

export const spotifyTokens = sqliteTable("spotifyTokens", {
  id: integer("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id),
  accessToken: text("accessToken").notNull(),
  refreshToken: text("refreshToken").notNull(),
  active: integer("active").notNull().default(0).$type<0 | 1>(),
  ...timestamp,
});

export const trackHistory = sqliteTable("trackHistory", {
  id: integer("id").primaryKey(),
  trackId: text("trackId").notNull(),
  startedAt: integer("startedAt").notNull(),
  endedAt: integer("endedAt").notNull(),
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
  spotifyTokens: many(spotifyTokens),
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

export const spotifyTokensRelations = relations(spotifyTokens, ({ one }) => ({
  user: one(users, {
    fields: [spotifyTokens.userId],
    references: [users.id],
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
