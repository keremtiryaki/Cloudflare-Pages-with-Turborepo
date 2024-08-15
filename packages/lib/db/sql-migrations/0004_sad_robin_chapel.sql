CREATE TABLE `hostnames` (
	`hostname` text PRIMARY KEY NOT NULL,
	`website_id` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `website_id_idx` ON `hostnames` (`website_id`);