import * as migration_20251225_125350_add_status_fields from './20251225_125350_add_status_fields';
import * as migration_20251225_153332_add_community_schema from './20251225_153332_add_community_schema';
import * as migration_20251225_170929_add_matching_engine_schema from './20251225_170929_add_matching_engine_schema';
import * as migration_20251225_184359_add_timeline_to_applications from './20251225_184359_add_timeline_to_applications';
import * as migration_20251226_100000_migrate_matching_data from './20251226_100000_migrate_matching_data';

export const migrations = [
  {
    up: migration_20251225_125350_add_status_fields.up,
    down: migration_20251225_125350_add_status_fields.down,
    name: '20251225_125350_add_status_fields',
  },
  {
    up: migration_20251225_153332_add_community_schema.up,
    down: migration_20251225_153332_add_community_schema.down,
    name: '20251225_153332_add_community_schema',
  },
  {
    up: migration_20251225_170929_add_matching_engine_schema.up,
    down: migration_20251225_170929_add_matching_engine_schema.down,
    name: '20251225_170929_add_matching_engine_schema',
  },
  {
    up: migration_20251225_184359_add_timeline_to_applications.up,
    down: migration_20251225_184359_add_timeline_to_applications.down,
    name: '20251225_184359_add_timeline_to_applications',
  },
  {
    up: migration_20251226_100000_migrate_matching_data.up,
    down: migration_20251226_100000_migrate_matching_data.down,
    name: '20251226_100000_migrate_matching_data'
  },
];
