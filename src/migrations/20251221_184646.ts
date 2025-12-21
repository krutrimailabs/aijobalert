import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Migration skipped as schema already exists in the database
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Down migration skipped to prevent data loss of pre-existing schema
}
