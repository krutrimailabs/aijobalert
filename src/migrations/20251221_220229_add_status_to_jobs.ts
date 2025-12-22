import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_jobs_status" AS ENUM('open', 'admit_card', 'result', 'closed');
  ALTER TABLE "jobs" ADD COLUMN "status" "enum_jobs_status" DEFAULT 'open';`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "jobs" DROP COLUMN "status";
  DROP TYPE "public"."enum_jobs_status";`)
}
