import { IEntryData } from '@akashaorg/typings/ui';

interface IDraft {
  appName: string;
  pubKey: string;
}

interface ISaveDraft extends IDraft {
  content: IEntryData['slateContent'];
}

const getDraftKey = (appName: string, pubKey: string) => `${appName}-${pubKey}-draft-item`;

export function saveDraftItem({ content, appName, pubKey }: ISaveDraft) {
  window.localStorage.setItem(getDraftKey(appName, pubKey), JSON.stringify(content));
}

export function getDraftItem({ appName, pubKey }: IDraft) {
  try {
    return JSON.parse(
      window.localStorage.getItem(getDraftKey(appName, pubKey)),
    ) as IEntryData['slateContent'];
  } catch {
    return null;
  }
}

export function clearDraftItem({ appName, pubKey }: IDraft) {
  window.localStorage.removeItem(getDraftKey(appName, pubKey));
}
