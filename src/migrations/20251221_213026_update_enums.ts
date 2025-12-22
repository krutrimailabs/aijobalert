import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'ssc';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'upsc';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'state_psc';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'psu';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'judiciary';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'medical';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'research';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'agriculture';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'sports';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'other';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'state_psc';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'psu';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'judiciary';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'medical';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'research';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'agriculture';
  ALTER TYPE "public"."enum_jobs_category" ADD VALUE 'sports';
  ALTER TABLE "users_qualification" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_qualification";
  CREATE TYPE "public"."enum_users_qualification" AS ENUM('8TH', '10TH', '12TH', 'ITI', 'Diploma', 'Graduate', 'PG', 'PhD', 'B.Tech', 'M.Tech', 'MBBS', 'BDS', 'CA_ICWA', 'LLB', 'LLM', 'B.Ed', 'M.Ed', 'B.Pharm', 'M.Pharm', 'B.Sc_Nursing', 'M.Sc_Nursing');
  ALTER TABLE "users_qualification" ALTER COLUMN "value" SET DATA TYPE "public"."enum_users_qualification" USING "value"::"public"."enum_users_qualification";
  ALTER TABLE "users" ALTER COLUMN "domicile_state" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_domicile_state";
  CREATE TYPE "public"."enum_users_domicile_state" AS ENUM('AP', 'AR', 'AS', 'BR', 'CG', 'GA', 'GJ', 'HR', 'HP', 'JH', 'KA', 'KL', 'MP', 'MH', 'MN', 'ML', 'MZ', 'NL', 'OD', 'PB', 'RJ', 'SK', 'TN', 'TS', 'TR', 'UP', 'UK', 'WB', 'AN', 'CH', 'DN', 'DL', 'JK', 'LA', 'LD', 'PY');
  ALTER TABLE "users" ALTER COLUMN "domicile_state" SET DATA TYPE "public"."enum_users_domicile_state" USING "domicile_state"::"public"."enum_users_domicile_state";
  ALTER TABLE "jobs_education" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_jobs_education";
  CREATE TYPE "public"."enum_jobs_education" AS ENUM('8TH', '10TH', '12TH', 'ITI', 'Diploma', 'Graduate', 'PG', 'PhD', 'B.Tech', 'M.Tech', 'MBBS', 'BDS', 'CA_ICWA', 'LLB', 'LLM', 'B.Ed', 'M.Ed', 'B.Pharm', 'M.Pharm', 'B.Sc_Nursing', 'M.Sc_Nursing');
  ALTER TABLE "jobs_education" ALTER COLUMN "value" SET DATA TYPE "public"."enum_jobs_education" USING "value"::"public"."enum_jobs_education";
  ALTER TABLE "jobs" ALTER COLUMN "state" SET DATA TYPE text;
  DROP TYPE "public"."enum_jobs_state";
  CREATE TYPE "public"."enum_jobs_state" AS ENUM('AP', 'AR', 'AS', 'BR', 'CG', 'GA', 'GJ', 'HR', 'HP', 'JH', 'KA', 'KL', 'MP', 'MH', 'MN', 'ML', 'MZ', 'NL', 'OD', 'PB', 'RJ', 'SK', 'TN', 'TS', 'TR', 'UP', 'UK', 'WB', 'AN', 'CH', 'DN', 'DL', 'JK', 'LA', 'LD', 'PY');
  ALTER TABLE "jobs" ALTER COLUMN "state" SET DATA TYPE "public"."enum_jobs_state" USING "state"::"public"."enum_jobs_state";`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_qualification" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_qualification";
  CREATE TYPE "public"."enum_users_qualification" AS ENUM('10TH', '12TH', 'ITI', 'Diploma', 'Graduate', 'B.Tech', 'PG');
  ALTER TABLE "users_qualification" ALTER COLUMN "value" SET DATA TYPE "public"."enum_users_qualification" USING "value"::"public"."enum_users_qualification";
  ALTER TABLE "users" ALTER COLUMN "domicile_state" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_domicile_state";
  CREATE TYPE "public"."enum_users_domicile_state" AS ENUM('TS', 'AP', 'UP', 'DL', 'MH');
  ALTER TABLE "users" ALTER COLUMN "domicile_state" SET DATA TYPE "public"."enum_users_domicile_state" USING "domicile_state"::"public"."enum_users_domicile_state";
  ALTER TABLE "jobs_category" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_jobs_category";
  CREATE TYPE "public"."enum_jobs_category" AS ENUM('bank', 'teaching', 'engineering', 'railway', 'police');
  ALTER TABLE "jobs_category" ALTER COLUMN "value" SET DATA TYPE "public"."enum_jobs_category" USING "value"::"public"."enum_jobs_category";
  ALTER TABLE "jobs_education" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_jobs_education";
  CREATE TYPE "public"."enum_jobs_education" AS ENUM('8TH', '10TH', '12TH', 'Diploma', 'ITI', 'Graduate', 'B.Tech', 'PG');
  ALTER TABLE "jobs_education" ALTER COLUMN "value" SET DATA TYPE "public"."enum_jobs_education" USING "value"::"public"."enum_jobs_education";
  ALTER TABLE "jobs" ALTER COLUMN "state" SET DATA TYPE text;
  DROP TYPE "public"."enum_jobs_state";
  CREATE TYPE "public"."enum_jobs_state" AS ENUM('AP', 'AS', 'BR', 'CG', 'DL', 'GJ', 'TS', 'UP', 'WB');
  ALTER TABLE "jobs" ALTER COLUMN "state" SET DATA TYPE "public"."enum_jobs_state" USING "state"::"public"."enum_jobs_state";`)
}
