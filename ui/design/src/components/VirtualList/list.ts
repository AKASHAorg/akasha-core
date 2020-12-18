import throttle from 'lodash.throttle';
import Rect from './rect-obj';
import Viewport from './viewport';
import { isIntersecting } from '../../utils/virtual-list';

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
  coords: { [key: string]: { top: number; height: number } };
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
  | { type: 'SET_COORDINATES'; payload: { [key: string]: Rect } }
  | { type: 'UPDATE_COORDINATE'; payload: { id: string; rect: Rect } }
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
    this.coords = {};
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
      startIdx = this.items.length;
      this.items = this.items.concat(items);
    }
    this.initCoordinatesFor(this.items, startIdx, position);
  }
  updateCoords(key: string, rect: { top: number; height: number }) {
    this.coords = { ...this.coords, ...{ [key]: rect } };
  }
  initCoordinatesFor(ids: string[], startAtIdx: number, position?: 'top') {
    const slice = ids.slice(startAtIdx, ids.length);
    // const coords = {};
    for (const [idx, id] of slice.entries()) {
      const prevRect = this.coords[this.items[idx - 1]];
      let rect;
      if (position !== 'top' && prevRect) {
        if (prevRect) {
          rect = Object.assign({}, prevRect, { top: prevRect.top + prevRect.height });
        } else {
          rect = { top: idx * this.config.avgItemHeight, height: this.config.avgItemHeight };
        }
      } else {
        rect = {
          top: idx * this.config.avgItemHeight,
          height: this.config.avgItemHeight,
        };
      }
      this.totalItemsHeight += rect.height;
      this.coords = Object.assign({}, this.coords, { [id]: rect });
      this.update('SET_TOTAL_ITEMS_HEIGHT', this.totalItemsHeight);
      this.update('SET_COORDINATES', this.coords);
    }
  }
  /**
   * logic when an item rect changes it's dimensions
   *
   */
  updateItemRect(itemId: string, rect: { top: number; height: number }) {
    const itemRect = this.coords[itemId] as { top: number; height: number };
    const isFirstItem = this.items.indexOf(itemId) === 0;
    let updatedIdx = -1;
    // update first item
    if (isFirstItem) {
      if (itemRect.height !== rect.height) {
        const newRect = Object.assign({}, itemRect, {
          top: this.config.spacing,
          height: rect.height,
        });
        // this.updateCoords(itemId, newRect);
        this.coords = Object.assign({}, this.coords, { [itemId]: newRect });
        this.update('SET_COORDINATES', this.coords);
        updatedIdx = 0;
      }
    }
    // update the element
    if (!isFirstItem) {
      if (itemRect.height !== rect.height) {
        const prevCoords = this.coords[this.items[this.items.indexOf(itemId) - 1]];
        const newTop = prevCoords.top + prevCoords.height + this.config.spacing;
        const newRect = Object.assign({}, itemRect, {
          height: rect.height,
          top: newTop,
        });
        this.coords = Object.assign({}, this.coords, { [itemId]: newRect });
        this.update('SET_COORDINATES', this.coords);
        updatedIdx = this.items.indexOf(itemId);
      }
    }
    // update all elements below the currently updated item
    // warning: do not block these updates!
    if (updatedIdx >= 0) {
      this.items.slice(updatedIdx + 1).forEach(id => {
        const prevCoords = this.coords[this.items[this.items.indexOf(id) - 1]];
        const itemCoord = this.coords[id];
        const rectWithDelta = Object.assign({}, itemCoord, {
          top: prevCoords.top + prevCoords.height + this.config.spacing,
        });
        this.coords = Object.assign({}, this.coords, { [id]: rectWithDelta });
        this.update('UPDATE_COORDINATE', { id, rect: rectWithDelta });
      });
    }

    if (itemRect) {
      this.totalItemsHeight = this.totalItemsHeight - itemRect.height + rect.height;
    }

    this.updateAverageItemHeight(rect.height);
    this.update('SET_TOTAL_ITEMS_HEIGHT', this.totalItemsHeight);
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
      const coord = this.coords[itemId];
      if (coord) {
        return coord.top + coord.height >= this.viewport.getBottom();
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
    let intersectingId = null;
    if (this.scrollDir === 'up') {
      intersectingId = this.items
        .slice(0, this.slice[0])
        .reverse()
        .find(id => {
          return isIntersecting(this.coords[id], this.viewport.getRect());
        });
    } else {
      intersectingId = this.items.slice(this.slice[1], this.items.length).find(id => {
        return isIntersecting(this.coords[id], this.viewport.getRect());
      });
    }
    return intersectingId;
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

    if (data.coords.size) {
      Object.entries(data.coords).forEach(([key, rect]) => {
        this.totalItemsHeight += rect.height /* + this.config.spacing */;
        this.updateCoords(key, rect);
        this.update('UPDATE_COORDINATE', { rect, id: key });
      });
    }

    unlisteners.push(scrollUnlistener);
    return unlisteners;
  }
}

export default ListEngine;
