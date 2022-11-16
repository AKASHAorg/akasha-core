import { IEntryData } from '@akashaorg/typings/ui';

interface IDraft {
  appName: string;
  pubKey: string;
}

interface ISaveDraft extends IDraft {
  content: IEntryData['slateContent'];
}

export interface IDraftStorage {
  setItem(key: string, value: string): void;
  getItem(key: string): string;
  removeItem(key: string): void;
}

const getDraftKey = (appName: string, pubKey: string) => `${appName}-${pubKey}-draft-item`;

export function Draft(storage: IDraftStorage) {
  this.storage = storage;
}

Draft.prototype = {
  save({ content, appName, pubKey }: ISaveDraft) {
    this.storage.setItem(getDraftKey(appName, pubKey), JSON.stringify(content));
  },
  get({ appName, pubKey }: IDraft) {
    try {
      return JSON.parse(
        this.storage.getItem(getDraftKey(appName, pubKey)),
      ) as IEntryData['slateContent'];
    } catch {
      return null;
    }
  },
  clear({ appName, pubKey }: IDraft) {
    this.storage.removeItem(getDraftKey(appName, pubKey));
  },
};
