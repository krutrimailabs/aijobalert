import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_votes_type" AS ENUM('up', 'down');
   EXCEPTION
    WHEN duplicate_object THEN null;
   END $$;

   CREATE TABLE IF NOT EXISTS "forum_topics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"icon_id" integer,
  	"slug" varchar,
  	"thread_count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "votes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"type" "enum_votes_type" NOT NULL,
  	"thread_id" integer,
  	"comment_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "downvotes" numeric DEFAULT 0;
  ALTER TABLE "comments" ADD COLUMN IF NOT EXISTS "upvotes" numeric DEFAULT 0;
  ALTER TABLE "threads" ADD COLUMN IF NOT EXISTS "topic_id" integer;
  ALTER TABLE "threads" ADD COLUMN IF NOT EXISTS "upvotes" numeric DEFAULT 0;
  ALTER TABLE "threads" ADD COLUMN IF NOT EXISTS "downvotes" numeric DEFAULT 0;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "forum_topics_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "votes_id" integer;

  DO $$ BEGIN
    ALTER TABLE "forum_topics" ADD CONSTRAINT "forum_topics_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "votes" ADD CONSTRAINT "votes_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "votes" ADD CONSTRAINT "votes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "forum_topics_icon_idx" ON "forum_topics" USING btree ("icon_id");
  CREATE INDEX IF NOT EXISTS "forum_topics_slug_idx" ON "forum_topics" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "forum_topics_updated_at_idx" ON "forum_topics" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "forum_topics_created_at_idx" ON "forum_topics" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "votes_user_idx" ON "votes" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "votes_thread_idx" ON "votes" USING btree ("thread_id");
  CREATE INDEX IF NOT EXISTS "votes_comment_idx" ON "votes" USING btree ("comment_id");
  CREATE INDEX IF NOT EXISTS "votes_updated_at_idx" ON "votes" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "votes_created_at_idx" ON "votes" USING btree ("created_at");

  DO $$ BEGIN
    ALTER TABLE "threads" ADD CONSTRAINT "threads_topic_id_forum_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."forum_topics"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forum_topics_fk" FOREIGN KEY ("forum_topics_id") REFERENCES "public"."forum_topics"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_votes_fk" FOREIGN KEY ("votes_id") REFERENCES "public"."votes"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "threads_topic_idx" ON "threads" USING btree ("topic_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_forum_topics_id_idx" ON "payload_locked_documents_rels" USING btree ("forum_topics_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_votes_id_idx" ON "payload_locked_documents_rels" USING btree ("votes_id");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "forum_topics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "votes" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "forum_topics" CASCADE;
  DROP TABLE "votes" CASCADE;
  ALTER TABLE "threads" DROP CONSTRAINT "threads_topic_id_forum_topics_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_forum_topics_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_votes_fk";
  
  DROP INDEX "threads_topic_idx";
  DROP INDEX "payload_locked_documents_rels_forum_topics_id_idx";
  DROP INDEX "payload_locked_documents_rels_votes_id_idx";
  ALTER TABLE "comments" DROP COLUMN "downvotes";
  ALTER TABLE "comments" DROP COLUMN "upvotes";
  ALTER TABLE "threads" DROP COLUMN "topic_id";
  ALTER TABLE "threads" DROP COLUMN "upvotes";
  ALTER TABLE "threads" DROP COLUMN "downvotes";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "forum_topics_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "votes_id";
  DROP TYPE "public"."enum_votes_type";`)
}
