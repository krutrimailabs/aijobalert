import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_qualification" AS ENUM('10TH', '12TH', 'ITI', 'Diploma', 'Graduate', 'B.Tech', 'PG');
  CREATE TYPE "public"."enum_users_domicile_state" AS ENUM('TS', 'AP', 'UP', 'DL', 'MH');
  
  CREATE TABLE "users_qualification" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_qualification",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "users" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "users" ADD COLUMN "domicile_state" "enum_users_domicile_state";
  
  ALTER TABLE "users_qualification" ADD CONSTRAINT "users_qualification_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  
  CREATE INDEX "users_qualification_order_idx" ON "users_qualification" USING btree ("order");
  CREATE INDEX "users_qualification_parent_idx" ON "users_qualification" USING btree ("parent_id");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_qualification" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_category" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs_education" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "jobs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_qualification" CASCADE;
  DROP TABLE "jobs_category" CASCADE;
  DROP TABLE "jobs_education" CASCADE;
  DROP TABLE "jobs" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_jobs_fk";
  
  DROP INDEX "payload_locked_documents_rels_jobs_id_idx";
  ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL;
  ALTER TABLE "users" DROP COLUMN "domicile_state";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "jobs_id";
  DROP TYPE "public"."enum_users_qualification";
  DROP TYPE "public"."enum_users_domicile_state";
  DROP TYPE "public"."enum_jobs_category";
  DROP TYPE "public"."enum_jobs_education";
  DROP TYPE "public"."enum_jobs_state";`)
}
