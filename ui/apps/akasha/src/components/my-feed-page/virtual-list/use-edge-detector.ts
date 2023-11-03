import { HEADER_COMPONENT, LOADING_INDICATOR, VirtualItemInfo } from './virtual-item';
import { Rect } from './rect';
import React from 'react';

export const enum EdgeArea {
  TOP = 'top',
  BOTTOM = 'bottom',
  NEAR_TOP = 'near-top',
  NEAR_BOTTOM = 'near-bottom',
}

export type UseEdgeDetectorProps = {
  overscan: number;
  onLoadNext: (lastKey: string) => void;
  onLoadPrev: (firstKey: string) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onEdgeDetectorChange: (edgeArea: EdgeArea) => void;
};
export type DetectorState = {
  listSize?: number;
  newArea?: EdgeArea;
};

export const useEdgeDetector = (props: UseEdgeDetectorProps) => {
  const { overscan, onEdgeDetectorChange, onLoadPrev, onLoadNext, hasNextPage, hasPreviousPage } =
    props;
  const [detectorState, setDetectorState] = React.useState<DetectorState>({});

  return {
    update: (
      itemList: VirtualItemInfo[],
      rendered: VirtualItemInfo[],
      viewportRect: Rect,
      averageItemHeight: number,
      isNewUpdate: boolean,
    ) => {
      if (!isNewUpdate) return;
      const overscanHeight = overscan * averageItemHeight;
      const filteredItems = itemList.filter(
        it => !it.key.startsWith(LOADING_INDICATOR) && it.key !== HEADER_COMPONENT,
      );
      const listRect = new Rect(
        filteredItems.at(0).start,
        filteredItems.at(-1).start + filteredItems.at(-1).height,
      );
      let newArea: EdgeArea;
      if (viewportRect.getTop() === listRect.getTop()) {
        newArea = EdgeArea.TOP;
      }
      if (viewportRect.getBottom() === listRect.getBottom()) {
        newArea = EdgeArea.BOTTOM;
      }
      if (viewportRect.getTop() - listRect.getTop() <= overscanHeight && newArea !== EdgeArea.TOP) {
        newArea = EdgeArea.NEAR_TOP;
      }
      if (
        listRect.getBottom() - viewportRect.getBottom() <= overscanHeight &&
        newArea !== EdgeArea.BOTTOM
      ) {
        newArea = EdgeArea.NEAR_BOTTOM;
      }
      if (newArea === detectorState.newArea && itemList.length === detectorState.listSize) {
        return;
      }
      setDetectorState({
        newArea,
        listSize: itemList.length,
      });
      onEdgeDetectorChange(newArea);
    },
  };
};
