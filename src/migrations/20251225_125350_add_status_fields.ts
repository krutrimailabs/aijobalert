import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_threads_status" AS ENUM('published', 'pending', 'rejected');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_comments_status" AS ENUM('published', 'pending', 'rejected');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "threads" ADD COLUMN IF NOT EXISTS "status" "enum_threads_status" DEFAULT 'published';
    ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "status" "enum_comments_status" DEFAULT 'published';
    ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "thread_id" integer;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "threads" DROP COLUMN IF EXISTS "status";
    ALTER TABLE "comments" DROP COLUMN IF EXISTS "status";
    ALTER TABLE "comments" DROP COLUMN IF EXISTS "thread_id";
  `)
}
