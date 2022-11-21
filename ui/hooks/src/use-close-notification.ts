import { useState } from 'react';

const INITIAL_CLOSE_STATE = false;
const LOCAL_STORAGE_KEY = 'close-notification-flags';

export const checkMessageCardId = (key: string) => {
  const closedFlags = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');

  if (closedFlags.find(flag => flag === key) !== undefined) {
    console.warn('A Duplicate Notification ID was provided!');
    return key;
  }
  closedFlags.push(key);
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(closedFlags));

  return key;
};

const writeToLocalStorage = (key: string, value: boolean): void => {
  if (window?.localStorage) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

export function useCloseNotification(
  key: string,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const [closed, setClosed] = useState<boolean>(() => {
    if (window?.localStorage) {
      const currentClosedStatus = JSON.parse(window.localStorage.getItem(key));

      if (currentClosedStatus) {
        return currentClosedStatus;
      } else {
        writeToLocalStorage(key, INITIAL_CLOSE_STATE);
        return INITIAL_CLOSE_STATE;
      }
    }
  });

  const setValue = (newClosedValue: boolean) => {
    setClosed(newClosedValue);
    writeToLocalStorage(key, newClosedValue);
  };
  return [closed, setValue];
}
