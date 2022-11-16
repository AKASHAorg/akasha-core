import { IEntryData } from '@akashaorg/typings/ui';

export interface IDraftStorage {
  setItem(key: string, value: string): void;
  getItem(key: string): string;
  removeItem(key: string): void;
}

const getDraftKey = (appName: string, pubKey: string) => `${appName}-${pubKey}-draft-item`;

export function Draft(storage: IDraftStorage, appName: string, pubKey: string) {
  this.storage = storage;
  this.appName = appName;
  this.pubKey = pubKey;
}

Draft.prototype = {
  save(content: IEntryData['slateContent']) {
    this.storage.setItem(getDraftKey(this.appName, this.pubKey), JSON.stringify(content));
  },
  get() {
    try {
      return JSON.parse(
        this.storage.getItem(getDraftKey(this.appName, this.pubKey)),
      ) as IEntryData['slateContent'];
    } catch {
      return null;
    }
  },
  clear() {
    this.storage.removeItem(getDraftKey(this.appName, this.pubKey));
  },
};
