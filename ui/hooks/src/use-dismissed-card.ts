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

export function useDismissedCard(statusStorage?: IStorage): [string[], (newId: string) => void] {
  const storage = statusStorage || window.localStorage;

  const [ids, setIds] = useState<string[]>(() => {
    if (storage) {
      const currentClosedStatus = JSON.parse(storage.getItem(LOCAL_STORAGE_KEY)) as string[];

      if (currentClosedStatus) {
        return currentClosedStatus;
      }
      return INITIAL_CLOSE_STATE;
    }
  });

  const setValue = (newId: string) => {
    setIds(prevIds => {
      const uniqueIds = new Set(prevIds);

      if (uniqueIds.has(newId)) {
        return [...uniqueIds];
      }

      uniqueIds.add(newId);
      writeToLocalStorage(storage, LOCAL_STORAGE_KEY, [...uniqueIds]);

      return [...uniqueIds];
    });
  };

  return [ids, setValue];
}
