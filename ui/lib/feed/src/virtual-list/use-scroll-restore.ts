import React from 'react';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { RestorationItem } from './virtual-list';

export type ScrollState<T> = {
  listHeight: number;
  scrollOffset: number;
  items: RestorationItem<T>[];
};

export type UseScrollRestoreProps = {
  restoreKey: string;
  enabled: boolean;
};

export const useScrollRestore = <T>({ restoreKey, enabled }: UseScrollRestoreProps) => {
  const isRestored = React.useRef(false);
  const [isFetched, setIsFetched] = React.useState(false);
  const [scrollState, setScrollState] = React.useState<{
    listHeight: number;
    items: { key: string; offsetTop: number }[];
  }>();

  const saveScrollState = (state: {
    listHeight: number;
    items: { key: string; offsetTop: number }[];
  }) => {
    if (!enabled) return;
    window.history.replaceState(
      Object.assign(window.history.state ?? {}, { [restoreKey]: state }),
      '',
    );
  };

  const fetchScrollState = () => {
    if (!enabled) {
      return setIsFetched(true);
    }
    const historyState = window?.history?.state;
    if (historyState && hasOwn(historyState, restoreKey)) {
      setScrollState(historyState[restoreKey]);
    }
    setIsFetched(true);
  };

  return {
    saveScrollState,
    fetchScrollState,
    scrollState,
    isFetched,
    restore: () => (isRestored.current = true),
    isRestored: isRestored.current,
  };
};
