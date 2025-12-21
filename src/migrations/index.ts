import * as migration_20251221_184646 from './20251221_184646';
import * as migration_20251221_203612_update_user_schema from './20251221_203612_update_user_schema';
import * as migration_20251221_213026_update_enums from './20251221_213026_update_enums';
import * as migration_20251221_213257_update_enums from './20251221_213257_update_enums';
import * as migration_20251221_220229_add_status_to_jobs from './20251221_220229_add_status_to_jobs';

export const migrations = [
  {
    up: migration_20251221_184646.up,
    down: migration_20251221_184646.down,
    name: '20251221_184646',
  },
  {
    up: migration_20251221_203612_update_user_schema.up,
    down: migration_20251221_203612_update_user_schema.down,
    name: '20251221_203612_update_user_schema',
  },
  {
    up: migration_20251221_213026_update_enums.up,
    down: migration_20251221_213026_update_enums.down,
    name: '20251221_213026_update_enums',
  },
  {
    up: migration_20251221_213257_update_enums.up,
    down: migration_20251221_213257_update_enums.down,
    name: '20251221_213257_update_enums',
  },
  {
    up: migration_20251221_220229_add_status_to_jobs.up,
    down: migration_20251221_220229_add_status_to_jobs.down,
    name: '20251221_220229_add_status_to_jobs'
  },
];
