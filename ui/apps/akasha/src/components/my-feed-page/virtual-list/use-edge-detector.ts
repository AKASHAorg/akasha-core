import { VirtualItemInfo } from './virtual-item';
import { RenderedItem } from './use-projection';

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
    update: (itemList: VirtualItemInfo[], rendered: RenderedItem[]) => {
      const firstRendered = rendered.at(0);
      const lastRendered = rendered.at(rendered.length - 1);
      const firstIdx = itemList.findIndex(it => it.itemKey === firstRendered.item.key);
      const lastIdx = itemList.findIndex(it => it.itemKey === lastRendered.item.key);

      if (firstIdx > 0 && firstIdx <= overscan) {
        if (hasPrevPage) {
          onLoadPrev?.(itemList.at(0).itemKey);
        }
        return;
      }

      if (lastIdx > 0 && lastIdx + overscan >= itemList.length) {
        if (hasNextPage) {
          onLoadNext(itemList.at(itemList.length - 1).itemKey);
        }
        return;
      }
    },
  };
};
