import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db: _db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  // Migration skipped as schema already exists in the database
}

export async function down({ db: _db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  // Down migration skipped to prevent data loss of pre-existing schema
}
