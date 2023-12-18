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

const getListRect = (filteredItems: VirtualItem[]) => {
  const filteredStart = filteredItems.at(0);
  const filteredEnd = filteredItems.at(-1);
  if (filteredStart && filteredEnd) {
    return new Rect(filteredStart.start, filteredEnd.start + filteredEnd.height);
  }
};

export const useEdgeDetector = (props: UseEdgeDetectorProps) => {
  const { overscan, onEdgeDetectorChange } = props;

  const detectorState = React.useRef<DetectorState>({
    listSize: 0,
  });

  const getEdge = (
    viewportRect: Rect,
    listRect: Rect,
    overscanHeight: number,
    listSize: number,
  ) => {
    let newArea = EdgeArea.NONE;

    if (listSize > 1) {
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
    }

    return newArea;
  };

  const isNewArea = (newArea: EdgeArea) => newArea !== detectorState.current.newArea;

  const update = React.useCallback(
    (
      itemList: VirtualItem[],
      _rendered: VirtualItem[],
      viewportRect: Rect,
      getItemHeightAverage: () => number,
      isNewUpdate: boolean,
    ) => {
      if (!isNewUpdate) return;
      const overscanHeight = overscan * getItemHeightAverage();
      const filteredItems = itemList.filter(it => it.maybeRef);
      if (!filteredItems.length && !detectorState.current.newArea) {
        detectorState.current = {
          newArea: EdgeArea.TOP,
          listSize: 0,
        };
        return onEdgeDetectorChange(EdgeArea.TOP);
      }
      const listRect = getListRect(filteredItems);
      const newArea = getEdge(viewportRect, listRect, overscanHeight, itemList.length);

      if (isNewArea(newArea)) {
        detectorState.current = {
          newArea,
          listSize: itemList.length,
        };
        onEdgeDetectorChange(newArea);
      }
    },
    [onEdgeDetectorChange, overscan],
  );

  return {
    update,
  };
};
