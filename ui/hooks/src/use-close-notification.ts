import { useState } from 'react';

export function useCloseNotification(key: string, initialValue = false) {
  const [closed, setClosed] = useState(() => {
    if (window?.localStorage) {
      try {
        const closedFlag = window.localStorage.getItem(key);
        if (closedFlag) {
          return JSON.parse(closedFlag);
        } else {
          window.localStorage.setItem(key, JSON.stringify(initialValue));
          return initialValue;
        }
      } catch (err) {
        // console.log(err);
        return initialValue;
      }
    }
  });

  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const newClosedValue = value instanceof Function ? value(closed) : value;
      setClosed(newClosedValue);
      if (window?.localStorage) {
        window.localStorage.setItem(key, JSON.stringify(newClosedValue));
      }
    } catch (err) {
      console.log(err);
    }
  };
  return [closed, setValue];
}
