import Dexie from 'dexie';
import type { IntegrationSchema } from './integrations.schema';
import type { SettingsSchema } from './settings.schema';

export default class DbWrapper extends Dexie {
  integrations!: Dexie.Table<IntegrationSchema, string>;
  settings!: Dexie.Table<SettingsSchema, number>;

  constructor(dbName: string) {
    super(dbName);
    this.version(1).stores({
      integrations: 'id, name, integrationType, version, sources, status, config',
      settings: '++id, &serviceName, *options',
    });
  }
}
