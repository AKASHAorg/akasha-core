import { Rect } from './rect';

export interface ViewportRect {
  bottom: number;
  height: number;
  width: number;
  top: number;
  left: number;
  right: number;
}

export interface IItemStateRect {
  rect: Rect;
  /* initial render notification flag */
  canRender: boolean;
  /* absolute index of the item */
  index: number;
}

export interface Anchor {
  index: number;
  offset: number;
}

export type ItemRects = Map<string, IItemStateRect>;

export interface AnchorData {
  anchor: Anchor;
  scrollTop: number;
}
export interface IVirtualListProps {
  items: string[];
  itemsData: {};
  /* Boolean to load item data in a second call (loadItemData) - default: false */
  useItemDataLoader?: boolean;
  loadMore: (payload: ILoadItemsPayload) => void;
  loadItemData?: (payload: ILoadItemDataPayload) => void;
  itemCard: React.ReactElement;
  listHeader?: React.ReactElement;
  /* spacing between items (bottom) */
  itemSpacing?: number;
  /* How many items we want per request */
  loadLimit?: number;
  /* The initial list padding top */
  initialPaddingTop?: number;
  /* The id from which we want to start fetching entries */
  startId?: string;
  /* Items to keep in view on top and bottom of visible ones */
  overscan?: number;
  customEntities?: IListCustomEntity[];
  initialState?: IListInitialState;
  hasMoreItems?: boolean;
  getNotificationPill?: (props: { styles: React.CSSProperties }) => React.ReactElement;
  showNotificationPill?: boolean;
  onItemRead?: (itemId: string) => void;
  averageItemHeight?: number;
  ref?: React.Ref<any>;
  usePlaceholders?: boolean;
}

export interface ILoadItemsPayload {
  start?: string;
  limit: number;
  reverse?: boolean;
}
export interface ILoadItemDataPayload {
  itemId: string;
}

export interface IListCustomEntity {
  position: string | 'before' | 'after';
  itemIndex?: number;
  itemId?: string | null;
  getComponent: React.FC<any> | ((props: any) => React.FC<any>);
}

export interface IListInitialState {
  /* starting id */
  startId: string;
  /* total list height */
  totalHeight: number;
  /* top position of the first item (startId) */
  startTop: number;
}

export type UseVirtualScrollProps = Pick<
  IVirtualListProps,
  | 'averageItemHeight'
  | 'itemSpacing'
  | 'overscan'
  | 'items'
  | 'initialState'
  | 'loadMore'
  | 'hasMoreItems'
> & {
  averageItemHeight: number;
  itemSpacing: number;
  overscan: number;
};

export interface IListViewportProps {
  itemsData: { [key: string]: any };
  itemRects: Map<string, IItemStateRect>;
  itemCard: React.ReactElement;
  loadItemData: IVirtualListProps['loadItemData'];
  itemSpacing: number;
  customEntities?: IVirtualListProps['customEntities'];
  isFetching: boolean;
  useItemDataLoader: IVirtualListProps['useItemDataLoader'];
  listHeight: number;
  updateRef?: (itemId: string, ref: React.ElementRef<'div'> | null, isUnmounting?: boolean) => void;
  renderSlice: string[];
  itemIds: string[];
  averageItemHeight: number;
  listHeader?: React.ReactElement;
  loadLimit: number;
  usePlaceholders: boolean;
}
export interface IRenderItemProps {
  itemId: string;
  itemData?: any;
  loadItemData: IVirtualListProps['loadItemData'];
  itemSpacing: IVirtualListProps['itemSpacing'];
  customEntities: IListCustomEntity[];
  itemCard: IVirtualListProps['itemCard'];
  updateRef?: IListViewportProps['updateRef'];
  itemRect?: IItemStateRect;
  prevRect?: IItemStateRect | null;
  averageItemHeight: number;
  itemIndex?: number;
  className?: string;
}
