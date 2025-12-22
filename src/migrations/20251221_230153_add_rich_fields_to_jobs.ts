import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "jobs_important_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  ALTER TABLE "jobs" ADD COLUMN "application_fee" jsonb;
  ALTER TABLE "jobs" ADD COLUMN "selection_process" jsonb;
  ALTER TABLE "jobs" ADD COLUMN "short_notification_id" integer;
  ALTER TABLE "jobs_important_links" ADD CONSTRAINT "jobs_important_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "jobs_important_links_order_idx" ON "jobs_important_links" USING btree ("_order");
  CREATE INDEX "jobs_important_links_parent_id_idx" ON "jobs_important_links" USING btree ("_parent_id");
  ALTER TABLE "jobs" ADD CONSTRAINT "jobs_short_notification_id_media_id_fk" FOREIGN KEY ("short_notification_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "jobs_short_notification_idx" ON "jobs" USING btree ("short_notification_id");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "jobs_important_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "jobs_important_links" CASCADE;
  ALTER TABLE "jobs" DROP CONSTRAINT "jobs_short_notification_id_media_id_fk";
  
  DROP INDEX "jobs_short_notification_idx";
  ALTER TABLE "jobs" DROP COLUMN "application_fee";
  ALTER TABLE "jobs" DROP COLUMN "selection_process";
  ALTER TABLE "jobs" DROP COLUMN "short_notification_id";`)
}
