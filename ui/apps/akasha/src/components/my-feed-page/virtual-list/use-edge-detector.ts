import { HEADER_COMPONENT, LOADING_INDICATOR, VirtualItemInfo } from './virtual-item';
import React from 'react';

export type UseEdgeDetectorProps = {
  overscan: number;
  onLoadNext: (lastKey: string) => void;
  onLoadPrev: (firstKey: string) => void;
};

export const useEdgeDetector = (props: UseEdgeDetectorProps) => {
  const { overscan, onLoadPrev, onLoadNext } = props;
  const fetchPrevLock = React.useRef(true);
  const pageCursors = React.useRef<string[]>([]);
  return {
    // @TODO: requires a bit of refactoring
    // disallow fetching if it's not scrolling from outside the area
    update: (
      itemList: VirtualItemInfo[],
      rendered: VirtualItemInfo[],
      alreadyMeasured: boolean,
    ) => {
      if (!alreadyMeasured) return;
      const items = rendered.filter(
        it => !it.key.startsWith(LOADING_INDICATOR) && it.key !== HEADER_COMPONENT,
      );
      const filteredItemList = itemList.filter(
        it => !it.key.startsWith(LOADING_INDICATOR) && it.key !== HEADER_COMPONENT,
      );
      const lastRendered = items.at(items.length - 1);
      if (lastRendered) {
        const lastIdx = itemList.findIndex(it => it.key === lastRendered.key);
        if (
          lastIdx > 0 &&
          lastIdx + overscan >= itemList.length &&
          !pageCursors.current.includes(filteredItemList.at(filteredItemList.length - 1).key)
        ) {
          onLoadNext(filteredItemList.at(filteredItemList.length - 1).key);
          pageCursors.current.push(filteredItemList.at(filteredItemList.length - 1).key);
        }
      }
      const firstRendered = items.at(0);
      if (firstRendered) {
        const firstIdx = itemList.findIndex(it => it.key === firstRendered.key);
        if (
          firstIdx > 0 &&
          firstIdx <= overscan &&
          !fetchPrevLock.current &&
          !pageCursors.current.includes(filteredItemList.at(0).key)
        ) {
          onLoadPrev?.(filteredItemList.at(0).key);
          fetchPrevLock.current = true;
          pageCursors.current.unshift(filteredItemList.at(0).key);
        }
        if (firstIdx > overscan) {
          fetchPrevLock.current = false;
        }
      }
    },
  };
};
