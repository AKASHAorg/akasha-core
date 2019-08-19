import { RxCollection, RxDocument } from 'rxdb';

export type SettingsDocType = {
  ethAddress: string;
  moduleName: string;
  services: Array<[string, any]>;
};

export type SettingsDocMethods = {
  getSettingsObject(): object;
};

export type SettingsDoc = RxDocument<SettingsDocType, SettingsDocMethods>;

export type SettingsCollectionMethods = {
  getAllSettings: () => Promise<[]>;
};

export type SettingsCollection = RxCollection<
  SettingsDocType,
  SettingsDocMethods,
  SettingsCollectionMethods
>;
