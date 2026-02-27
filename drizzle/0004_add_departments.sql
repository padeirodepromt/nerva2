-- Phase: Departments (first-class entity) + Project Department binding

-- 1) Departments catalog
CREATE TABLE IF NOT EXISTS "departments" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"realm_id" text DEFAULT 'personal' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint

DO $$ BEGIN
 ALTER TABLE "departments" ADD CONSTRAINT "departments_key_unique" UNIQUE("key");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

-- 2) User departments (installation/contract)
CREATE TABLE IF NOT EXISTS "user_departments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"department_id" text NOT NULL,
	"status" text DEFAULT 'installed' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb,
	"installed_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint

DO $$ BEGIN
 ALTER TABLE "user_departments" ADD CONSTRAINT "user_departments_user_department_unique" UNIQUE("user_id","department_id");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

DO $$ BEGIN
 ALTER TABLE "user_departments" ADD CONSTRAINT "user_departments_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

DO $$ BEGIN
 ALTER TABLE "user_departments" ADD CONSTRAINT "user_departments_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "user_departments_user_id_index" ON "user_departments" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_departments_department_id_index" ON "user_departments" USING btree ("department_id");
--> statement-breakpoint

-- 3) Projects: bind to a department
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "department_id" text;
--> statement-breakpoint

DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_department_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "projects_department_id_index" ON "projects" USING btree ("department_id");
--> statement-breakpoint

-- 4) Seed default departments (dev + narrative)
INSERT INTO "departments" ("id", "key", "name", "description", "realm_id", "config")
VALUES
	('dept_dev', 'dev', 'Departamento DEV', 'Programação e arquitetura (Neo, TaskCodeWorkspace, refactors, etc.)', 'professional', '{}'::jsonb),
	('dept_narrative', 'narrative', 'Departamento Narrativa', 'Conteúdo e estratégia (Flor, TaskContentWorkspace, BrandCode/ContentCode)', 'professional', '{}'::jsonb)
ON CONFLICT ("key") DO NOTHING;