ALTER TABLE `restaurants` ADD `min_lat` real NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `restaurants` ADD `max_lat` real NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `restaurants` ADD `min_lng` real NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `restaurants` ADD `max_lng` real NOT NULL DEFAULT 0;--> statement-breakpoint
CREATE INDEX `min_lat_idx` ON `restaurants` (`min_lat`);--> statement-breakpoint
CREATE INDEX `max_lat_idx` ON `restaurants` (`max_lat`);--> statement-breakpoint
CREATE INDEX `min_lng_idx` ON `restaurants` (`min_lng`);--> statement-breakpoint
CREATE INDEX `max_lng_idx` ON `restaurants` (`max_lng`);