import * as migration_20251225_125350_add_status_fields from './20251225_125350_add_status_fields';
import * as migration_20251225_153332_add_community_schema from './20251225_153332_add_community_schema';
import * as migration_20251225_170929_add_matching_engine_schema from './20251225_170929_add_matching_engine_schema';

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
    name: '20251225_170929_add_matching_engine_schema'
  },
];
