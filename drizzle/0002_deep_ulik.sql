ALTER TABLE "tasks" ADD COLUMN "file_id" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "completed_at" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_file_id_papyrus_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."papyrus_documents"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
