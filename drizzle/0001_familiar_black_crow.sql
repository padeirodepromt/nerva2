CREATE TABLE IF NOT EXISTS "file_task_associations" (
	"id" text PRIMARY KEY NOT NULL,
	"file_id" text NOT NULL,
	"task_id" text NOT NULL,
	"document_type" text DEFAULT 'note',
	"relationship" text DEFAULT 'modify',
	"created_at" timestamp DEFAULT now(),
	"created_by" text,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "file_task_associations_file_id_task_id_pk" PRIMARY KEY("file_id","task_id")
);
--> statement-breakpoint
ALTER TABLE "diary_entries" DROP CONSTRAINT "diary_entries_morning_energy_fk";
--> statement-breakpoint
ALTER TABLE "diary_entries" DROP CONSTRAINT "diary_entries_afternoon_energy_fk";
--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "related_files_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "papyrus_documents" ADD COLUMN "related_tasks_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "papyrus_documents" ADD COLUMN "is_linked_to_task" boolean DEFAULT false;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_task_associations" ADD CONSTRAINT "file_task_associations_file_id_papyrus_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."papyrus_documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_task_associations" ADD CONSTRAINT "file_task_associations_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "file_task_associations" ADD CONSTRAINT "file_task_associations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_task_associations_file_id_index" ON "file_task_associations" USING btree ("file_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "file_task_associations_task_id_index" ON "file_task_associations" USING btree ("task_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "diary_entries" ADD CONSTRAINT "diary_entries_morning_energy_fk" FOREIGN KEY ("linked_morning_energy_id") REFERENCES "public"."energy_checkins"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "diary_entries" ADD CONSTRAINT "diary_entries_afternoon_energy_fk" FOREIGN KEY ("linked_afternoon_energy_id") REFERENCES "public"."energy_checkins"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
