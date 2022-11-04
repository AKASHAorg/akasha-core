import { IEntryData } from '@akashaorg/typings/ui';

const DRAFT_POST = '@draftPost';

export function saveDraftPost(content: IEntryData['slateContent']) {
  window.localStorage.setItem(DRAFT_POST, JSON.stringify(content));
}

export function getDraftPost() {
  try {
    return JSON.parse(window.localStorage.getItem(DRAFT_POST)) as IEntryData['slateContent'];
  } catch {
    return null;
  }
}

export function clearDraftPost() {
  window.localStorage.removeItem(DRAFT_POST);
}
