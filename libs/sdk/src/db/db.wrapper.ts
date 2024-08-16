import Dexie from 'dexie';
import type { InstalledExtensionSchema } from './installed-extensions.schema';
import type { SettingsSchema } from './settings.schema';
import { DevExtensionSchema } from './dev-extension.schema';

export default class DbWrapper extends Dexie {
  installedExtensions!: Dexie.Table<InstalledExtensionSchema, string>;
  devExtensions!: Dexie.Table<DevExtensionSchema, string>;
  settings!: Dexie.Table<SettingsSchema, number>;

  constructor(dbName: string) {
    super(dbName);
    this.version(1).stores({
      installedExtensions: 'id, name, integrationType, version, sources, status, config',
      devExtensions: '++id, name, integrationType, sources',
      settings: '++id, &serviceName, *options',
    });
  }
}
