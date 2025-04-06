CREATE TABLE `spotifyProfiles` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`spotifyUsername` text NOT NULL,
	`accessToken` text NOT NULL,
	`refreshToken` text NOT NULL,
	`active` integer DEFAULT 0 NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `spotifyProfiles_spotifyUsername_unique` ON `spotifyProfiles` (`spotifyUsername`);--> statement-breakpoint
DROP TABLE `spotifyTokens`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_authIds` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` integer,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_authIds`("id", "userId", "expiresAt", "createdAt", "updatedAt") SELECT "id", "userId", "expiresAt", "createdAt", "updatedAt" FROM `authIds`;--> statement-breakpoint
DROP TABLE `authIds`;--> statement-breakpoint
ALTER TABLE `__new_authIds` RENAME TO `authIds`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_trackHistory` (
	`id` integer PRIMARY KEY NOT NULL,
	`trackId` text NOT NULL,
	`startedAt` integer NOT NULL,
	`endedAt` integer NOT NULL,
	`profile` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`profile`) REFERENCES `spotifyProfiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_trackHistory`("id", "trackId", "startedAt", "endedAt", "profile", "createdAt", "updatedAt") SELECT "id", "trackId", "startedAt", "endedAt", "profile", "createdAt", "updatedAt" FROM `trackHistory`;--> statement-breakpoint
DROP TABLE `trackHistory`;--> statement-breakpoint
ALTER TABLE `__new_trackHistory` RENAME TO `trackHistory`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`passwordHash` text NOT NULL,
	`permissions` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "name", "passwordHash", "permissions", "createdAt", "updatedAt") SELECT "id", "email", "name", "passwordHash", "permissions", "createdAt", "updatedAt" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `__new_voteRounds` (
	`id` integer PRIMARY KEY NOT NULL,
	`startedAt` integer NOT NULL,
	`endedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_voteRounds`("id", "startedAt", "endedAt", "createdAt", "updatedAt") SELECT "id", "startedAt", "endedAt", "createdAt", "updatedAt" FROM `voteRounds`;--> statement-breakpoint
DROP TABLE `voteRounds`;--> statement-breakpoint
ALTER TABLE `__new_voteRounds` RENAME TO `voteRounds`;--> statement-breakpoint
CREATE TABLE `__new_votes` (
	`id` integer PRIMARY KEY NOT NULL,
	`roundId` integer NOT NULL,
	`userId` integer NOT NULL,
	`trackId` text NOT NULL,
	`count` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`roundId`) REFERENCES `voteRounds`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_votes`("id", "roundId", "userId", "trackId", "count", "createdAt", "updatedAt") SELECT "id", "roundId", "userId", "trackId", "count", "createdAt", "updatedAt" FROM `votes`;--> statement-breakpoint
DROP TABLE `votes`;--> statement-breakpoint
ALTER TABLE `__new_votes` RENAME TO `votes`;