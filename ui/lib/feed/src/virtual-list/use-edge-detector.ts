import React from 'react';
import { VirtualItem } from './virtual-item-renderer';
import { Rect } from './rect';

export const enum EdgeArea {
  NONE = 'none',
  TOP = 'top',
  BOTTOM = 'bottom',
  NEAR_TOP = 'near-top',
  NEAR_BOTTOM = 'near-bottom',
}

export type UseEdgeDetectorProps = {
  overscan: number;
  onEdgeDetectorChange: (edgeArea: EdgeArea) => void;
};
export type DetectorState = {
  listSize?: number;
  newArea?: EdgeArea;
};

export const useEdgeDetector = (props: UseEdgeDetectorProps) => {
  const { overscan, onEdgeDetectorChange } = props;

  const detectorState = React.useRef<DetectorState>({
    listSize: 0,
  });

  const prevArea = React.useRef<EdgeArea>(EdgeArea.NONE);

  return {
    update: (
      itemList: VirtualItem[],
      rendered: VirtualItem[],
      viewportRect: Rect,
      averageItemHeight: number,
      isNewUpdate: boolean,
    ) => {
      if (!isNewUpdate) return;
      const overscanHeight = overscan * averageItemHeight;
      const filteredItems = itemList.filter(it => it.maybeRef);
      if (!filteredItems.length && !detectorState.current.newArea) {
        detectorState.current = {
          newArea: EdgeArea.TOP,
          listSize: 0,
        };
        return onEdgeDetectorChange(EdgeArea.TOP);
      }
      const filteredStart = filteredItems.at(0);
      const filteredEnd = filteredItems.at(-1);
      let newArea: EdgeArea = EdgeArea.NONE;
      if (filteredStart && filteredEnd && filteredStart !== filteredEnd) {
        const listRect = new Rect(filteredStart.start, filteredEnd.start + filteredEnd.height);
        if (viewportRect.getTop() === listRect.getTop()) {
          newArea = EdgeArea.TOP;
        }
        if (viewportRect.getBottom() === listRect.getBottom()) {
          newArea = EdgeArea.BOTTOM;
        }
        if (
          viewportRect.getTop() - listRect.getTop() <= overscanHeight &&
          newArea !== EdgeArea.TOP &&
          detectorState.current.newArea !== EdgeArea.NEAR_TOP &&
          detectorState.current.newArea !== EdgeArea.TOP
        ) {
          newArea = EdgeArea.NEAR_TOP;
        }
        if (
          listRect.getBottom() - viewportRect.getBottom() <= overscanHeight &&
          newArea !== EdgeArea.BOTTOM &&
          detectorState.current.newArea !== EdgeArea.NEAR_BOTTOM
        ) {
          newArea = EdgeArea.NEAR_BOTTOM;
        }
        detectorState.current = {
          newArea,
          listSize: itemList.length,
        };
      }
      if (newArea !== prevArea.current) {
        onEdgeDetectorChange(newArea);
      }
    },
  };
};
