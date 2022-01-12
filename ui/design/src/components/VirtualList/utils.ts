import { Anchor, AnchorData, ItemRects } from './interfaces';
import { Rect } from './rect';

export enum InsertPoint {
  LIST_HEAD = 1,
  LIST_TAIL,
  LIST_BETWEEN,
}

export const diffArr = (prev: string[], curr: string[]) => {
  let insertPoint;
  let diff: string[] = [];
  if (prev.length === curr.length) {
    return {
      insertPoint,
      diffItems: diff,
    };
  }
  if (!prev.length || curr[curr.length - 1] !== prev[prev.length - 1]) {
    insertPoint = InsertPoint.LIST_TAIL;
    diff = curr.slice(prev.length);
    return {
      insertPoint,
      diffItems: diff,
    };
  }
  if (prev.length && curr[0] !== prev[0]) {
    insertPoint = InsertPoint.LIST_HEAD;
    diff = curr.slice(0, curr.indexOf(prev[0]));
    return {
      insertPoint,
      diffItems: diff,
    };
  }
  return {
    insertPoint,
    diffItems: diff,
  };
};

export const getLastRendered = (
  startAnchor: Anchor,
  viewportBottom: number,
  rects: ItemRects,
  items: string[],
) => {
  let idx = startAnchor.index;
  for (; idx < items.length; ) {
    if (!rects.has(items[idx])) {
      break;
    }
    const rect = rects.get(items[idx])?.rect;
    if (rect.getBottom() < viewportBottom) {
      idx += 1;
    } else {
      break;
    }
  }
  return idx;
};

export interface ComputeAnchorProps {
  anchor: Anchor;
  delta: number;
  rects: ItemRects;
  items: string[];
  averageItemHeight: number;
  itemSpacing: number;
}

export const computeAnchoredItem = (props: ComputeAnchorProps) => {
  const { anchor, delta, rects, items, averageItemHeight, itemSpacing } = props;
  let newDelta = delta;
  if (newDelta === 0) {
    return anchor;
  }
  newDelta += anchor.offset;

  let i = anchor.index;

  let renderedItems = 0;
  if (newDelta < 0) {
    while (
      newDelta < 0 &&
      i > 0 &&
      rects.get(items[i - 1]) &&
      rects.get(items[i - 1])?.rect.getHeight()
    ) {
      newDelta += rects.get(items[i - 1])?.rect.getHeight() + itemSpacing;
      i -= 1;
    }
    renderedItems = Math.max(
      -i,
      Math.ceil(Math.min(newDelta, 0) / (averageItemHeight + itemSpacing)),
    );
  } else {
    while (
      newDelta > 0 &&
      i < rects.size &&
      rects.get(items[i]) &&
      rects.get(items[i])?.rect.getHeight() + itemSpacing < newDelta
    ) {
      newDelta -= rects.get(items[i])?.rect.getHeight() + itemSpacing;
      i += 1;
    }
    if (i >= rects.size || !rects.get(items[i])) {
      // renderedItems = rects.size;
      renderedItems = Math.floor(Math.max(newDelta, 0) / (averageItemHeight + itemSpacing));
    }
  }
  i += renderedItems;
  newDelta -= renderedItems * (averageItemHeight + itemSpacing);
  return {
    index: i,
    offset: newDelta,
  };
};

export interface GetAnchorProps {
  anchorData: AnchorData;
  getScrollTop: () => number;
  rects: ItemRects;
  items: string[];
  averageItemHeight: number;
  itemSpacing: number;
}

export const getAnchor = (props: GetAnchorProps) => {
  const { anchorData, getScrollTop, rects, items, averageItemHeight, itemSpacing } = props;
  const delta = getScrollTop() - anchorData.scrollTop;

  let anchorItem: Anchor;
  if (getScrollTop() === 0) {
    anchorItem = { index: 0, offset: 0 };
  } else {
    anchorItem = computeAnchoredItem({
      delta,
      rects,
      items,
      averageItemHeight,
      itemSpacing,
      anchor: anchorData.anchor,
    });
  }
  if (delta < 0) {
    // scrolling up
  } else {
    // scrolling down
  }
  return {
    scrollTop: getScrollTop(),
    anchor: anchorItem,
  };
};

export const updatePositions = (
  changedId: string,
  rect: Rect,
  prevPositions: { rects: ItemRects; listHeight: number },
) => {
  const newRects = new Map(prevPositions.rects);
  const changedRect = newRects.get(changedId);
  if (!changedRect) {
    return prevPositions;
  }
  const heightDelta = -1 * (changedRect.rect.getHeight() - rect.getHeight());
  const idx = changedRect.index;

  if (Math.abs(heightDelta) === 0) {
    return prevPositions;
  }

  // update current rect height;
  newRects.set(changedId, {
    ...changedRect,
    rect: changedRect.rect.translateBy(heightDelta, 0),
  });
  newRects.forEach((val, key) => {
    if (val.index <= idx) return;
    newRects.set(key, {
      ...val,
      rect: val.rect.translateBy(0, heightDelta),
    });
  });

  return {
    rects: newRects,
    listHeight: prevPositions.listHeight + heightDelta,
  };
};

export interface GetInitialRectProps {
  itemId: string;
  items: string[];
  refs: { [key: string]: HTMLDivElement };
  prevPositions: { rects: ItemRects; listHeight: number };
  globalOffsetTop: number;
  itemSpacing: number;
}
export const getInitialRect = (props: GetInitialRectProps) => {
  const { itemId, items, refs, prevPositions, globalOffsetTop, itemSpacing } = props;
  const globalIdx = items.indexOf(itemId);
  // this should be the height of the placeholder
  let initialHeight = 200;
  if (refs[itemId]) {
    initialHeight = refs[itemId].getBoundingClientRect().height;
  }
  const rectList = new Map(prevPositions.rects);
  let totalHeight = prevPositions.listHeight;
  let initialTop = itemSpacing;
  let prevItemRect;
  if (globalIdx === 0) {
    // check if we already have an item with index 0;
    const firstItem = Array.from(prevPositions.rects).find(([, val]) => val.index === 0);
    if (firstItem && firstItem[0] !== itemId) {
      // new item is prepended to the list
      // move items in the list lower
      rectList.forEach((value, key) => {
        rectList.set(key, {
          rect: value.rect.translateBy(0, initialHeight + itemSpacing),
          index: items.indexOf(key),
          canRender: value.canRender,
        });
      });
    }
  }
  if (globalIdx > 0) {
    const prevId = items[globalIdx - 1];
    if (prevId) {
      prevItemRect = prevPositions.rects.get(prevId);
    }
  }
  if (prevItemRect && prevItemRect.rect) {
    initialTop += prevItemRect.rect.getBottom();
  } else if (globalIdx > 0 && refs[items[globalIdx - 1]]) {
    const prevDomRect = refs[items[globalIdx - 1]].getBoundingClientRect();
    initialTop += prevDomRect.top - globalOffsetTop + prevDomRect.height;
  }
  if (!prevPositions.rects.get(itemId)) {
    const rect = new Rect({ height: initialHeight, top: initialTop });
    rectList.set(itemId, { rect, canRender: true, index: globalIdx });
    totalHeight += rect.getHeight() + itemSpacing;
  }
  return {
    rects: rectList,
    listHeight: totalHeight,
  };
};

export const updateListHeight = (
  positionState: { rects: ItemRects; listHeight: number },
  items: string[],
  itemSpacing: number,
  averageItemHeight: number,
) => {
  let totalHeight = 0;
  items.forEach(item => {
    let itemHeight = averageItemHeight;
    const itemRect = positionState.rects.get(item)?.rect;
    if (itemRect) {
      itemHeight = itemRect.getHeight();
    }
    totalHeight += itemHeight + itemSpacing;
  });
  return {
    ...positionState,
    listHeight: totalHeight,
  };
};
