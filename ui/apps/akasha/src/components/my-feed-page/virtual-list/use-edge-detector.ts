import { VirtualItemInfo } from './virtual-item';

export type UseEdgeDetectorProps = {
  overscan: number;
  onLoadNext: (lastKey: string) => void;
  onLoadPrev: (firstKey: string) => void;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
};

export const useEdgeDetector = (props: UseEdgeDetectorProps) => {
  const { overscan, hasPrevPage, hasNextPage, onLoadPrev, onLoadNext } = props;
  return {
    update: (itemList: VirtualItemInfo[], rendered: VirtualItemInfo[]) => {
      const firstRendered = rendered.at(0);
      const lastRendered = rendered.at(rendered.length - 1);
      const firstIdx = itemList.findIndex(it => it.key === firstRendered.key);
      const lastIdx = itemList.findIndex(it => it.key === lastRendered.key);

      if (firstIdx > 0 && firstIdx <= overscan) {
        if (hasPrevPage) {
          onLoadPrev?.(itemList.at(0).key);
        }
        return;
      }

      if (lastIdx > 0 && lastIdx + overscan >= itemList.length) {
        if (hasNextPage) {
          console.log('load next:', itemList.at(itemList.length - 1));
          onLoadNext(itemList.at(itemList.length - 1).key);
        }
        return;
      }
    },
  };
};
