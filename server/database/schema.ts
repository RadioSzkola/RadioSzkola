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
  userId: integer("userId")
    .notNull()
    .references(() => users.id),
  trackId: text("trackId").notNull(),
  playedAt: integer("playedAt").notNull(),
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
