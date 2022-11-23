import { useState } from 'react';

const INITIAL_CLOSE_STATE = [];
const LOCAL_STORAGE_KEY = 'dismissed-card-ids';

const writeToLocalStorage = (key: string, value: string[]): void => {
  if (window?.localStorage) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

export function useDismissedCard(): [string[], (newClosedValue: string) => void] {
  const [closed, setClosed] = useState<string[]>(() => {
    if (window?.localStorage) {
      const currentClosedStatus = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY));

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
      writeToLocalStorage(LOCAL_STORAGE_KEY, newClosedValues);
      return newClosedValues;
    });
  };
  return [closed, setValue];
}
