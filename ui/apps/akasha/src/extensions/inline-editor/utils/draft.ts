import { IEntryData } from '@akashaorg/typings/ui';

export interface IDraftStorage {
  setItem(key: string, value: string): void;
  getItem(key: string): string;
  removeItem(key: string): void;
}

interface IDraft {
  storage: IDraftStorage;
  appName: string;
  pubKey: string;
  save(content: IEntryData['slateContent']): void;
  get(): void;
  clear(): void;
}

const getDraftKey = (appName: string, pubKey: string) => `${appName}-${pubKey}-draft-item`;

export class Draft implements IDraft {
  storage: IDraftStorage;
  appName: string;
  pubKey: string;

  constructor(storage: IDraftStorage, appName: string, pubKey: string) {
    this.storage = storage;
    this.appName = appName;
    this.pubKey = pubKey;
  }

  save(content: IEntryData['slateContent']) {
    this.storage.setItem(getDraftKey(this.appName, this.pubKey), JSON.stringify(content));
  }

  get() {
    try {
      return JSON.parse(
        this.storage.getItem(getDraftKey(this.appName, this.pubKey)),
      ) as IEntryData['slateContent'];
    } catch {
      return null;
    }
  }

  clear() {
    this.storage.removeItem(getDraftKey(this.appName, this.pubKey));
  }
}
