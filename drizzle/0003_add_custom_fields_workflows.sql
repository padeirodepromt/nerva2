-- Phase 1: Custom Fields & Workflows Schema

-- Project Custom Fields Table
CREATE TABLE IF NOT EXISTS "project_custom_fields" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"type" varchar(20) NOT NULL,
	"options" jsonb,
	"is_required" boolean DEFAULT false,
	"display_order" integer DEFAULT 0,
	"is_from_template" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "project_custom_fields_project_id_slug_unique" UNIQUE("project_id","slug")
);
--> statement-breakpoint

-- Project Workflows (Statuses) Table
CREATE TABLE IF NOT EXISTS "project_workflows" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"status_id" varchar(50) NOT NULL,
	"status_name" varchar(100) NOT NULL,
	"color" varchar(10),
	"icon" varchar(50),
	"display_order" integer DEFAULT 0,
	"is_from_template" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "project_workflows_project_id_status_id_unique" UNIQUE("project_id","status_id")
);
--> statement-breakpoint

-- Add Foreign Keys
DO $$ BEGIN
 ALTER TABLE "project_custom_fields" ADD CONSTRAINT "project_custom_fields_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

DO $$ BEGIN
 ALTER TABLE "project_workflows" ADD CONSTRAINT "project_workflows_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- Create Indexes
CREATE INDEX IF NOT EXISTS "project_custom_fields_project_id_index" ON "project_custom_fields" USING btree ("project_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_custom_fields_project_id_display_order_index" ON "project_custom_fields" USING btree ("project_id","display_order");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_workflows_project_id_index" ON "project_workflows" USING btree ("project_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "project_workflows_project_id_display_order_index" ON "project_workflows" USING btree ("project_id","display_order");
