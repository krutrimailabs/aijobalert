import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_education_history_level" AS ENUM('10th', '12th', 'Diploma', 'Graduate', 'PostGraduate', 'PhD');
  CREATE TYPE "public"."enum_users_disability_type" AS ENUM('VI', 'HI', 'LD', 'Other');
  CREATE TYPE "public"."enum_jobs_structured_requirements_education_levels" AS ENUM('10th', '12th', 'Diploma', 'Graduate', 'PostGraduate');
  CREATE TYPE "public"."enum_jobs_age_relaxation_rules_category" AS ENUM('SC', 'ST', 'OBC', 'PWD', 'EWS', 'Ex-Serviceman');
  CREATE TYPE "public"."enum_jobs_structured_requirements_gender" AS ENUM('Male', 'Female', 'Any');
  CREATE TABLE "users_education_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"level" "enum_users_education_history_level" NOT NULL,
  	"degree" varchar,
  	"stream" varchar,
  	"passing_year" numeric,
  	"percentage" numeric
  );
  
  CREATE TABLE "jobs_structured_requirements_education_levels" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "enum_jobs_structured_requirements_education_levels",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "jobs_structured_requirements_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "jobs_age_relaxation_rules" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category" "enum_jobs_age_relaxation_rules_category" NOT NULL,
  	"years" numeric NOT NULL
  );
  
  CREATE TABLE "jobs_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "users" ADD COLUMN "disability_is_enabled" boolean DEFAULT false;
  ALTER TABLE "users" ADD COLUMN "disability_type" "enum_users_disability_type";
  ALTER TABLE "users" ADD COLUMN "disability_percentage" numeric;
  ALTER TABLE "jobs" ADD COLUMN "structured_requirements_experience_min_years" numeric DEFAULT 0;
  ALTER TABLE "jobs" ADD COLUMN "structured_requirements_experience_max_years" numeric;
  ALTER TABLE "jobs" ADD COLUMN "structured_requirements_gender" "enum_jobs_structured_requirements_gender" DEFAULT 'Any';
  ALTER TABLE "users_education_history" ADD CONSTRAINT "users_education_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_structured_requirements_education_levels" ADD CONSTRAINT "jobs_structured_requirements_education_levels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."jobs_structured_requirements_education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_structured_requirements_education" ADD CONSTRAINT "jobs_structured_requirements_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_age_relaxation_rules" ADD CONSTRAINT "jobs_age_relaxation_rules_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_texts" ADD CONSTRAINT "jobs_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_education_history_order_idx" ON "users_education_history" USING btree ("_order");
  CREATE INDEX "users_education_history_parent_id_idx" ON "users_education_history" USING btree ("_parent_id");
  CREATE INDEX "jobs_structured_requirements_education_levels_order_idx" ON "jobs_structured_requirements_education_levels" USING btree ("order");
  CREATE INDEX "jobs_structured_requirements_education_levels_parent_idx" ON "jobs_structured_requirements_education_levels" USING btree ("parent_id");
  CREATE INDEX "jobs_structured_requirements_education_order_idx" ON "jobs_structured_requirements_education" USING btree ("_order");
  CREATE INDEX "jobs_structured_requirements_education_parent_id_idx" ON "jobs_structured_requirements_education" USING btree ("_parent_id");
  CREATE INDEX "jobs_age_relaxation_rules_order_idx" ON "jobs_age_relaxation_rules" USING btree ("_order");
  CREATE INDEX "jobs_age_relaxation_rules_parent_id_idx" ON "jobs_age_relaxation_rules" USING btree ("_parent_id");
  CREATE INDEX "jobs_texts_order_parent" ON "jobs_texts" USING btree ("order","parent_id");
  ALTER TABLE "users" DROP COLUMN "physically_disabled";`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_education_history" CASCADE;
  DROP TABLE "jobs_structured_requirements_education_levels" CASCADE;
  DROP TABLE "jobs_structured_requirements_education" CASCADE;
  DROP TABLE "jobs_age_relaxation_rules" CASCADE;
  DROP TABLE "jobs_texts" CASCADE;
  ALTER TABLE "users" ADD COLUMN "physically_disabled" boolean DEFAULT false;
  ALTER TABLE "users" DROP COLUMN "disability_is_enabled";
  ALTER TABLE "users" DROP COLUMN "disability_type";
  ALTER TABLE "users" DROP COLUMN "disability_percentage";
  ALTER TABLE "jobs" DROP COLUMN "structured_requirements_experience_min_years";
  ALTER TABLE "jobs" DROP COLUMN "structured_requirements_experience_max_years";
  ALTER TABLE "jobs" DROP COLUMN "structured_requirements_gender";
  DROP TYPE "public"."enum_users_education_history_level";
  DROP TYPE "public"."enum_users_disability_type";
  DROP TYPE "public"."enum_jobs_structured_requirements_education_levels";
  DROP TYPE "public"."enum_jobs_age_relaxation_rules_category";
  DROP TYPE "public"."enum_jobs_structured_requirements_gender";`)
}
