import { Anchor, AnchorData, ItemRects } from './interfaces';

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
    insertPoint = 'after';
    diff = curr.slice(prev.length);
    return {
      insertPoint,
      diffItems: diff,
    };
  }
  if (prev.length && curr[0] !== prev[0]) {
    insertPoint = 'before';
    diff = curr.slice(0, prev.length);
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
    // console.log(idx, items, rects);
    if (!rects.has(items[idx])) {
      // console.log('rect for', items[idx], 'is missing', rects, items, idx);
      break;
    }
    const rect = rects.get(items[idx])!.rect;
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
      rects.get(items[i - 1])!.rect.getHeight()
    ) {
      newDelta += rects.get(items[i - 1])!.rect.getHeight();
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
      rects.get(items[i])!.rect.getHeight() &&
      rects.get(items[i])!.rect.getHeight() < delta
    ) {
      newDelta -= rects.get(items[i])!.rect.getHeight();
      i += 1;
    }
    if (i >= rects.size || !rects.get(items[i])) {
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
  scrollTop: number;
  rects: ItemRects;
  items: string[];
  averageItemHeight: number;
  itemSpacing: number;
}

export const getAnchor = (props: GetAnchorProps) => {
  const { anchorData, scrollTop, rects, items, averageItemHeight, itemSpacing } = props;
  const delta = scrollTop - anchorData.scrollTop;

  let anchorItem: Anchor;
  if (scrollTop === 0) {
    anchorItem = { index: 0, offset: 0 };
  } else {
    anchorItem = computeAnchoredItem({
      anchor: anchorData.anchor,
      delta,
      rects,
      items,
      averageItemHeight,
      itemSpacing,
    });
  }
  if (delta < 0) {
    // scrolling up
  } else {
    // scrolling down
  }
  return {
    scrollTop: scrollTop,
    anchor: anchorItem,
  };
};
