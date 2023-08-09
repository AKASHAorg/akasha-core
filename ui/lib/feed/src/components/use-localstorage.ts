import * as React from 'react';

const isClient = () => {
  return typeof window !== 'undefined' && window.document && window.document.documentElement;
};

export const useLocalstorage = (storageKey: string) => {
  const getItem = () => {
    if (!storageKey) {
      console.error('storageKey parameter is missing');
      return null;
    }

    if (!isClient()) {
      return null;
    }

    try {
      const val = window.localStorage.getItem(storageKey);
      if (val && val !== 'undefined') {
        return JSON.parse(val);
      }
      console.warn('local storage key', storageKey, 'cannot be parsed');
      return null;
    } catch (err) {
      console.error('Failed to read local storage key', storageKey);
      return null;
    }
  };

  const [val, setVal] = React.useState(getItem());

  const storeValue = newValue => {
    let valueToStore = newValue;
    if (newValue instanceof Function) {
      valueToStore = newValue(val);
    }
    setVal(valueToStore);
    if (!isClient()) {
      return;
    }
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(valueToStore));
    } catch (err) {
      console.error('Cannot store item to localstorage', err);
    }
  };
  const removeValue = () => {
    if (!storageKey) {
      console.error('storageKey is not defined');
      return;
    }
    setVal(null);
    if (!isClient()) {
      return;
    }
    try {
      window.localStorage.removeItem(storageKey);
    } catch (err) {
      console.error('Cannot remove item from localStorage', err);
    }
  };
  return [val, storeValue, removeValue];
};
