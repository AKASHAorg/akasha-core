import throttle from 'lodash.throttle';
import Rect from './v2/rect-obj';
import Viewport from './v2/viewport';

interface ListEngineData {
  /**
   * A list of itemIds
   */
  items: string[];
  /**
   * the slice being shown
   * @param slice[0] the beginning of the slice
   * @param slice[1] last item being rendered
   */
  slice: [number, number];
  /**
   * A map with coords of every item
   * @key K => itemId
   * @value V => { top: number, height: number }
   */
  coords: Map<string, Rect>;
  onUpdate?: (type: string, payload: UpdatePayload) => void;
  /**
   * padding top
   */
  offsetTop?: number;
  /**
   * first item rendered => slice[0]
   * also used as an initial starting point
   */
  firstItemId?: string;
}
export type UpdatePayload =
  | { type: 'SLICE_CHANGE'; payload: any }
  | { type: 'RECT_UPDATE'; payload: any }
  | { type: 'SET_TOTAL_ITEMS_HEIGHT'; payload: number }
  | { type: 'SET_COORDINATES'; payload: Map<string, Rect> }
  | { type: 'SET_SLICE'; payload: { slice: [number, number]; paddingTop: number } }
  | { type: 'CREATE_FETCH_OP'; payload: { req: any; status: string } }
  | { type: 'SET_FETCH_OP'; payload: { req: any; status: string } }
  | { type: 'SET_SLICE_OP'; payload: [number, number] };

export interface IScrollingPosition {
  atStart: boolean;
  nearStart: boolean;
  atEnd: boolean;
  nearEnd: boolean;
}

class ListEngine {
  public coords: ListEngineData['coords'];
  public items: ListEngineData['items'];
  public slice: ListEngineData['slice'];
  public viewport: Viewport;
  public config: {
    avgItemHeight: number;
    /* @param spacing top margin for each element in list */
    spacing: number;
    offsetItems: number;
  };
  public totalItemsHeight: number;
  private updateCb: ListEngineData['onUpdate'];
  private lastScrollTop: number;
  /* first item that is rendered */
  private firstItemId: ListEngineData['firstItemId'];
  public scrollDir: 'up' | 'down';
  public hasMoreItems: boolean;

  constructor(config: {
    avgItemHeight: number;
    spacing: number;
    offsetItems: number;
    startId?: string;
    slice: [number, number];
    hasMoreItems: boolean;
  }) {
    const { avgItemHeight = 200, spacing = 8, offsetItems, startId, slice, hasMoreItems } = config;
    this.items = [];
    this.slice = slice;
    this.coords = new Map();
    this.totalItemsHeight = 0;
    this.config = {
      avgItemHeight,
      spacing,
      offsetItems,
    };
    this.updateCb = undefined;
    this.lastScrollTop = 0;
    this.hasMoreItems = hasMoreItems;
    /**
     * First item that is intersecting with viewport (visible)
     * used to resume list
     */
    this.firstItemId = startId;
    this.scrollDir = 'down';
  }
  addItems(items: string[], position?: 'top') {
    let startIdx;
    if (position === 'top') {
      startIdx = 0;
      this.items.unshift(...items);
    } else {
      startIdx = this.items.length - 1;
      this.items = this.items.concat(items);
    }
    this.initCoordinatesFor(items, startIdx, position);
  }
  initCoordinatesFor(ids: string[], startAtIdx: number, position?: 'top') {
    let prevRect = this.coords.get(this.items[startAtIdx]);
    ids.forEach((id, idx) => {
      let rect;
      if (position !== 'top' && prevRect) {
        rect = prevRect.translateY(prevRect.height + this.config.spacing);
      } else {
        rect = new Rect({
          top: idx * this.config.avgItemHeight + this.config.spacing,
          height: this.config.avgItemHeight,
        });
      }
      this.totalItemsHeight += rect.height + this.config.spacing;
      this.coords.set(id, rect);
      this.update('SET_COORDINATES', this.coords);
      prevRect = rect;
    });
  }
  updateItemRect(itemId: string, rect: Rect) {
    const itemRect = this.coords.get(itemId) as Rect;
    const isFirstItem = this.items.indexOf(itemId) === 0;
    let updatedIdx = -1;
    let updatedDelta = 0;
    if (isFirstItem) {
      if (itemRect.height !== rect.height) {
        const newRect = new Rect({
          height: rect.height,
          top: this.config.spacing,
        });
        this.coords.set(itemId, newRect);
        updatedIdx = 0;
        updatedDelta = itemRect.height - rect.height;
      }
    } else {
      const prevRect = this.coords.get(this.items[this.items.indexOf(itemId) - 1]);
      if (prevRect) {
        if (!itemRect) {
          this.coords.set(
            itemId,
            new Rect({
              height: rect.height,
              top: prevRect.top + prevRect.height + this.config.spacing,
            }),
          );
        }
        if (itemRect && itemRect.height !== rect.height) {
          let newRect = new Rect({ ...rect });
          newRect = newRect.update({
            top: prevRect.top + prevRect.height + this.config.spacing,
          });
          updatedDelta = itemRect.top - newRect.top + itemRect.height - newRect.height;
          updatedIdx = this.items.indexOf(itemId);
          this.coords.set(itemId, newRect);
        }
      }
    }
    if (updatedIdx >= 0 && updatedDelta !== 0) {
      this.items.slice(updatedIdx + 1).forEach(id => {
        const itemCoord = this.coords.get(id);
        if (itemCoord) {
          const rectWithDelta = itemCoord.update({
            top: itemCoord.top + -1 * updatedDelta,
          });
          this.coords.set(id, rectWithDelta);
        }
      });
    }
    if (itemRect) {
      this.totalItemsHeight = this.totalItemsHeight - itemRect.height + rect.height;
    }
    this.updateAverageItemHeight(rect.height);
    this.update('SET_TOTAL_ITEMS_HEIGHT', this.totalItemsHeight);
    this.update('SET_COORDINATES', this.coords);
  }
  update(type: string, payload: any) {
    if (this.updateCb) {
      this.updateCb(type, payload);
    }
  }
  getScrollingPosition(_clientHeight: number, scrollTop: number): IScrollingPosition {
    const viewportBottom = this.viewport.getBottom();
    const disToBottom = this.totalItemsHeight - viewportBottom;
    const bufferHeight = (this.config.offsetItems + 1) * this.config.avgItemHeight;
    const atStart = scrollTop <= this.config.avgItemHeight * 0.5;
    const nearStart = scrollTop <= bufferHeight && scrollTop > this.config.avgItemHeight * 0.5;
    const nearEnd = disToBottom <= bufferHeight && disToBottom > this.config.avgItemHeight * 0.5;
    const atEnd = disToBottom <= this.config.avgItemHeight * 0.5;

    return {
      atStart,
      nearStart,
      nearEnd,
      atEnd,
    };
  }
  getBottomSlice(startIdx: number) {
    const id = this.items.slice(startIdx).find(itemId => {
      const coord = this.coords.get(itemId);
      if (coord) {
        return coord.getBottom() >= this.viewport.getBottom();
      }
      return false;
    });
    if (id) {
      return Math.min(this.items.indexOf(id) + this.config.offsetItems, this.items.length);
    }
    return this.items.length;
  }
  computeSlice(firstIntersectingId?: string) {
    if (firstIntersectingId) {
      const sliceStart = Math.max(
        0,
        this.items.indexOf(firstIntersectingId) - this.config.offsetItems,
      );
      const sliceEnd = this.getBottomSlice(this.items.indexOf(firstIntersectingId));
      if (sliceStart !== this.slice[0] || sliceEnd !== this.slice[1]) {
        this.firstItemId = firstIntersectingId;
        this.updateSlice(sliceStart, sliceEnd);
      }
    }
  }
  getFirstIntersectingId() {
    return this.items
      .slice(this.slice[0], this.slice[1])
      .find(id => this.coords.get(id)?.isIntersectingWith(this.viewport.getRect()));
  }
  onAtStart() {
    /* not implemented */
  }
  onNearStart() {
    /* load more items if needed */
  }
  onNearEnd() {
    /* load more items if needed */
    if (this.scrollDir === 'down') {
      this.createFetchOp({
        startId: this.items[this.items.length - 1],
        reverse: false,
        limit: this.config.offsetItems,
      });
    }
  }
  onAtEnd() {
    /* show a loading spinner or inform that there are no more entries */
    if (this.scrollDir === 'down') {
      this.createFetchOp({
        startId: this.items[this.items.length - 1],
        reverse: false,
        limit: this.config.offsetItems,
      });
    }
  }
  createFetchOp(req: { startId: string; reverse: boolean; limit: number }) {
    if (this.hasMoreItems) {
      this.update('CREATE_FETCH_OP', {
        req,
        status: 'pending',
      });
    }
  }
  onScroll(ev: Event) {
    const target = ev.target as Document;
    const clientHeight = window.document.documentElement.clientHeight;
    let scrollTop;
    if (target.scrollingElement) {
      scrollTop = target.scrollingElement.scrollTop;
    } else {
      scrollTop = document.documentElement.scrollTop;
    }
    this.scrollDir = this.lastScrollTop > scrollTop ? 'up' : 'down';
    const scrollingPosition = this.getScrollingPosition(clientHeight, scrollTop);
    this.firstItemId = this.getFirstIntersectingId() || this.firstItemId;
    if (scrollingPosition.atStart) {
      this.onAtStart();
    }
    if (scrollingPosition.nearStart) {
      this.onNearStart();
    }
    if (scrollingPosition.nearEnd) {
      this.onNearEnd();
    }
    if (scrollingPosition.atEnd) {
      this.onAtEnd();
    }
    this.computeSlice(this.firstItemId);
    this.lastScrollTop = scrollTop;
  }
  updateSlice(start: number, end: number) {
    this.slice = [start, end];
    this.update('SET_SLICE', {
      slice: this.slice,
    });
  }
  updateAverageItemHeight(itemHeight: number) {
    this.config.avgItemHeight =
      (this.config.avgItemHeight * (this.items.length - 1) + itemHeight) / this.items.length;
  }
  setHasMoreItems(hasMore: boolean) {
    this.hasMoreItems = hasMore;
  }
  init(data: ListEngineData) {
    const unlisteners = [];
    this.viewport = new Viewport({
      offsetTop: data.offsetTop || 0,
    });

    if (data.onUpdate) {
      this.updateCb = data.onUpdate;
    }
    const tScroll = throttle(this.onScroll, 100, { leading: true, trailing: false });
    const scrollUnlistener = this.viewport.addScrollListener(tScroll.bind(this));

    if (data.coords) {
      data.coords.forEach((rect, key) => {
        const itemRect = new Rect(rect);
        this.totalItemsHeight += itemRect.height + this.config.spacing;
        this.coords.set(key, itemRect);
      });
    }

    unlisteners.push(scrollUnlistener);
    return unlisteners;
  }
}

export default ListEngine;
