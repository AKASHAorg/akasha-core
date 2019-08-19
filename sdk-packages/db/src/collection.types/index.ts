import { RxDatabase } from 'rxdb';
import { SettingsCollection } from './settings';

type AKASHAdbCollections = {
  settings: SettingsCollection;
};

export type AKASHAdb = RxDatabase<AKASHAdbCollections>;
