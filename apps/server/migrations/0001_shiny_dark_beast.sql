CREATE TABLE `authId` (
	`id` text PRIMARY KEY NOT NULL,
	`inUse` integer NOT NULL,
	`userId` text,
	`expiresAt` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `session` ADD `createdAt` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `session` ADD `updatedAt` integer NOT NULL;