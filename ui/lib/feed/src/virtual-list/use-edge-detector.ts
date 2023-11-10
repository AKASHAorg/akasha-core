import React from 'react';
import { HEADER_COMPONENT, LOADING_INDICATOR, VirtualItemInfo } from './virtual-item';
import { Rect } from './rect';

export const enum EdgeArea {
  TOP = 'top',
  BOTTOM = 'bottom',
  NEAR_TOP = 'near-top',
  NEAR_BOTTOM = 'near-bottom',
}

export type UseEdgeDetectorProps = {
  overscan: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
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
    newArea: null,
  });

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
      if (!filteredItems.length) {
        detectorState.current = {
          newArea: EdgeArea.TOP,
          listSize: 0,
        };
        return onEdgeDetectorChange(EdgeArea.TOP);
      }
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
      if (newArea) {
        onEdgeDetectorChange(newArea);
      }
    },
  };
};
