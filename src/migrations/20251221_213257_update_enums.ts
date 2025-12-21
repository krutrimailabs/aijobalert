import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_users_domicile_state" ADD VALUE 'AI';
  ALTER TYPE "public"."enum_jobs_state" ADD VALUE 'AI';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ALTER COLUMN "domicile_state" SET DATA TYPE text;
  DROP TYPE "public"."enum_users_domicile_state";
  CREATE TYPE "public"."enum_users_domicile_state" AS ENUM('AP', 'AR', 'AS', 'BR', 'CG', 'GA', 'GJ', 'HR', 'HP', 'JH', 'KA', 'KL', 'MP', 'MH', 'MN', 'ML', 'MZ', 'NL', 'OD', 'PB', 'RJ', 'SK', 'TN', 'TS', 'TR', 'UP', 'UK', 'WB', 'AN', 'CH', 'DN', 'DL', 'JK', 'LA', 'LD', 'PY');
  ALTER TABLE "users" ALTER COLUMN "domicile_state" SET DATA TYPE "public"."enum_users_domicile_state" USING "domicile_state"::"public"."enum_users_domicile_state";
  ALTER TABLE "jobs" ALTER COLUMN "state" SET DATA TYPE text;
  DROP TYPE "public"."enum_jobs_state";
  CREATE TYPE "public"."enum_jobs_state" AS ENUM('AP', 'AR', 'AS', 'BR', 'CG', 'GA', 'GJ', 'HR', 'HP', 'JH', 'KA', 'KL', 'MP', 'MH', 'MN', 'ML', 'MZ', 'NL', 'OD', 'PB', 'RJ', 'SK', 'TN', 'TS', 'TR', 'UP', 'UK', 'WB', 'AN', 'CH', 'DN', 'DL', 'JK', 'LA', 'LD', 'PY');
  ALTER TABLE "jobs" ALTER COLUMN "state" SET DATA TYPE "public"."enum_jobs_state" USING "state"::"public"."enum_jobs_state";`)
}
