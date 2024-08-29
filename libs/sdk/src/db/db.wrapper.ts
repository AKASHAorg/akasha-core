import Dexie from 'dexie';
import type { InstalledExtensionSchema } from './installed-extensions.schema';
import type { SettingsSchema } from './settings.schema';

export default class DbWrapper extends Dexie {
  installedExtensions!: Dexie.Table<InstalledExtensionSchema, string>;
  settings!: Dexie.Table<SettingsSchema, number>;

  constructor(dbName: string) {
    super(dbName);
    this.version(1).stores({
      installedExtensions: '++, &releaseId, version, [releaseId+version], appName',
      settings: '++id, &serviceName, *options',
    });
  }
}
