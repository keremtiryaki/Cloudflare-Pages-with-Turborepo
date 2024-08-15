CREATE TABLE `restaurant_websites` (
	`restaurant_id` text NOT NULL,
	`website_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `websites` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `restaurant_website_pk` ON `restaurant_websites` (`restaurant_id`,`website_id`);