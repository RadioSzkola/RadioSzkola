CREATE TABLE `spotifySchoolToken` (
	`schoolId` text PRIMARY KEY NOT NULL,
	`spotifyTokenId` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`schoolId`) REFERENCES `school`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`spotifyTokenId`) REFERENCES `spotifyToken`(`id`) ON UPDATE no action ON DELETE no action
);
