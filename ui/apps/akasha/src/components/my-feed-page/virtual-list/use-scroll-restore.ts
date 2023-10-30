import React from 'react';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { RestorationItem } from './virtual-list';

export type ScrollState<T> = {
  listHeight: number;
  items: RestorationItem<T>[];
};

export type UseScrollRestoreProps = {
  restoreKey: string;
  enabled: boolean;
};

export const useScrollRestore = <T>({ restoreKey, enabled }: UseScrollRestoreProps) => {
  const [isRestoring, setIsRestoring] = React.useState<boolean>();
  const restored = React.useRef(false);
  const [scrollState, setScrollState] = React.useState<ScrollState<T>>();

  const saveScrollState = (state: ScrollState<T>) => {
    if (!enabled) return;
    window.history.replaceState(
      Object.assign(window.history.state ?? {}, { [restoreKey]: state }),
      '',
    );
  };
  const fetchScrollState = () => {
    if (!enabled) return;
    setIsRestoring(true);
    const historyState = window?.history?.state;
    if (historyState && hasOwn(historyState, restoreKey)) {
      setScrollState(historyState[restoreKey]);
    }
    restored.current = true;
    setIsRestoring(false);
  };

  return {
    saveScrollState,
    fetchScrollState,
    scrollState,
    isRestoring,
    isRestored: restored.current,
  };
};
