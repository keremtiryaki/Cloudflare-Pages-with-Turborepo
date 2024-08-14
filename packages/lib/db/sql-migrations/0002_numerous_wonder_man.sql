CREATE INDEX `lat_idx` ON `restaurants` (`lat`);--> statement-breakpoint
CREATE INDEX `lng_idx` ON `restaurants` (`lng`);--> statement-breakpoint
CREATE INDEX `lat_lng_idx` ON `restaurants` (`lat`,`lng`);