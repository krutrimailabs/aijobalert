import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
   CREATE TYPE "public"."enum_job_applications_timeline_stage" AS ENUM('Applied', 'Admit Card', 'Result', 'Selected', 'Rejected');
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  CREATE TABLE "job_applications_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"stage" "enum_job_applications_timeline_stage" NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"note" varchar
  );
  
  ALTER TABLE "job_applications" ADD COLUMN "application_id" varchar;
  ALTER TABLE "job_applications_timeline" ADD CONSTRAINT "job_applications_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "job_applications_timeline_order_idx" ON "job_applications_timeline" USING btree ("_order");
  CREATE INDEX "job_applications_timeline_parent_id_idx" ON "job_applications_timeline" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "job_applications_timeline" CASCADE;
  ALTER TABLE "job_applications" DROP COLUMN "application_id";
  DROP TYPE "public"."enum_job_applications_timeline_stage";`)
}
