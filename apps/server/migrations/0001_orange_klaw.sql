CREATE TABLE `spotifyToken` (
	`id` integer PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`access` text NOT NULL,
	`refresh` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
