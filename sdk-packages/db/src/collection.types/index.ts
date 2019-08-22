import { RxDatabase } from 'rxdb';
import { SettingsCollection } from './settings';

export interface AKASHAdbCollections {
  settings: SettingsCollection;
}

export type AKASHAdb = RxDatabase<AKASHAdbCollections>;
