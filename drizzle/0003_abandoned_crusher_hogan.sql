ALTER TABLE "projects" ADD COLUMN "type" text DEFAULT 'personal' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "is_shared" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "visibility" text DEFAULT 'private' NOT NULL;