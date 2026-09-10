CREATE TABLE `enquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text NOT NULL,
	`name` text NOT NULL,
	`company` text NOT NULL,
	`email` text NOT NULL,
	`country` text NOT NULL,
	`project_type` text NOT NULL,
	`details` text NOT NULL,
	`consent_at` text NOT NULL,
	`request_hash` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_enquiries_request_time` ON `enquiries` (`request_hash`,`created_at`);