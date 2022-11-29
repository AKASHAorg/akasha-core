import { useState } from 'react';

const INITIAL_CLOSE_STATE = [];
const LOCAL_STORAGE_KEY = 'dismissed-card-ids';

interface IStorage {
  setItem(key: string, value: string): void;
  getItem(key: string): string;
  removeItem(key: string): void;
}

const writeToLocalStorage = (storage: IStorage, key: string, value: string[]): void => {
  if (storage) {
    storage.setItem(key, JSON.stringify(value));
  }
};

export function useDismissedCard(
  draftStorage?: IStorage,
): [string[], (newClosedValue: string) => void] {
  const storage = draftStorage || window.localStorage;
  const [closed, setClosed] = useState<string[]>(() => {
    if (storage) {
      const currentClosedStatus = JSON.parse(storage.getItem(LOCAL_STORAGE_KEY));

      if (currentClosedStatus) {
        return currentClosedStatus;
      }
      return INITIAL_CLOSE_STATE;
    }
  });

  const setValue = (newClosedValue: string) => {
    setClosed(prevClosed => {
      if (prevClosed.includes(newClosedValue)) {
        return prevClosed;
      }
      const newClosedValues = prevClosed.concat(newClosedValue);
      writeToLocalStorage(storage, LOCAL_STORAGE_KEY, newClosedValues);
      return newClosedValues;
    });
  };
  return [closed, setValue];
}
