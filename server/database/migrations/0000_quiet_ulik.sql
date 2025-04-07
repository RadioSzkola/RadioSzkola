CREATE TABLE `authIds` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` integer,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `spotifyProfiles` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`spotifyUsername` text NOT NULL,
	`spotifyId` text NOT NULL,
	`accessToken` text NOT NULL,
	`refreshToken` text NOT NULL,
	`refreshTokenExpiresAt` integer NOT NULL,
	`active` integer DEFAULT 0 NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `spotifyProfiles_spotifyId_unique` ON `spotifyProfiles` (`spotifyId`);--> statement-breakpoint
CREATE TABLE `trackHistory` (
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
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`passwordHash` text NOT NULL,
	`permissions` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `voteRounds` (
	`id` integer PRIMARY KEY NOT NULL,
	`startedAt` integer NOT NULL,
	`endedAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `votes` (
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
