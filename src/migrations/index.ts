import * as migration_20251225_125350_add_status_fields from './20251225_125350_add_status_fields';

export const migrations = [
  {
    up: migration_20251225_125350_add_status_fields.up,
    down: migration_20251225_125350_add_status_fields.down,
    name: '20251225_125350_add_status_fields'
  },
];
