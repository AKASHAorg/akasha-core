import { IEntryData } from '../Cards/entry-cards/entry-box';
import Rect from './v2/rect-obj';

export interface IFetchOperation {
  startId: string;
  size: number;
  position: 'start' | 'end';
  status: 'pending' | 'requested' | 'completed' | 'error';
}

export interface ISliceOperation {
  position: 'start' | 'end';
  size: number;
}
export interface IListCustomEntity {
  position: string | 'before' | 'after';
  itemIndex?: number;
  itemId?: string | null;
  getComponent: React.FC<any> | ((props: any) => React.FC<any>);
}
export interface IListInitialState {
  startId?: string;
  startTop?: number;
  slice?: [number, number];
}

export type GetItemCardFn = (props: {
  itemId: string;
  itemData: any;
  isBookmarked?: boolean;
}) => React.ReactElement;

export interface ILoadItemsPayload {
  start?: string;
  limit: number;
  reverse?: boolean;
}

export interface ILoadItemDataPayload {
  itemId: string;
}
export interface IVirtualListProps {
  items: string[];
  itemsData: {};
  loadMore: (payload: ILoadItemsPayload) => void;
  loadItemData: (payload: ILoadItemDataPayload) => void;
  loadInitialFeed: (payload: ILoadItemsPayload) => void;
  itemCard?: React.FC<{ item: any }>;
  /* spacing between items (bottom) */
  itemSpacing?: number;
  /* How many items we want per request */
  loadLimit?: number;
  /* The initial list padding top */
  initialPaddingTop?: number;
  /* The id from which we want to start fetching entries */
  startId?: string;
  /* Items to keep in view on top and bottom of visible ones */
  offsetItems?: number;
  customEntities?: IListCustomEntity[];
  initialState?: IListInitialState;
  getItemCard: GetItemCardFn;
  hasMoreItems?: boolean;
  bookmarkedItems?: Set<string>;
  getNotificationPill?: (props: { styles: React.CSSProperties }) => React.ReactElement;
  showNotificationPill?: boolean;
  onItemRead?: (itemId: string) => void;
  ref?: React.Ref<any>;
}

export interface IListItemProps {
  item: {
    entryId: string;
  };
  itemData: {};
}

export interface IScrollState {
  /** scroll direction: 0 = upwards, 1 = downwards */
  direction: 0 | 1;
  scrollTop: number;
  topPad: number;
  bottomPad: number;
}

export interface IUseScrollStateOptions {
  node: HTMLElement | null;
}

export type ItemDimensions = {
  dimensions: {
    [key: string]: { height: number };
  };
  count: number;
  avgItemHeight: number;
  totalItemsHeight: number;
};

export type ItemDimensionsRef = React.MutableRefObject<ItemDimensions>;

export interface IListContentProps {
  itemCard?: React.FC<{ item: any }>;
  items: IVirtualListProps['items'];
  offsetItems: number;
  initialPaddingTop: number;
  loadItemData: IVirtualListProps['loadItemData'];
  itemsData: {};
  // // the available width of the list
  // width: number;
  // // the available height of the list
  // height: number;
  itemSpacing: number;
  loadLimit: number;
  onLoadMore: IVirtualListProps['loadMore'];
  customEntities: IListCustomEntity[];
  getItemCard: GetItemCardFn;
  listState: IListInitialState;
  setListState: any;
  hasMoreItems?: boolean;
  bookmarkedItems?: IVirtualListProps['bookmarkedItems'];
  onItemRead: IVirtualListProps['onItemRead'];
}

export interface IRenderItemProps {
  itemId: string;
  itemData?: any;
  loadItemData: IVirtualListProps['loadItemData'];
  onSizeChange: (itemId: string, dimension: any) => void;
  itemSpacing: IListContentProps['itemSpacing'];
  customEntities: IListCustomEntity[];
  getItemCard: GetItemCardFn;
  isBookmarked?: boolean;
  prevItemId?: string;
  coordinates: Map<string, Rect>;
  index: number;
}
export type SetSliceOperationType = React.Dispatch<React.SetStateAction<ISliceOperation>>;
export type SetFetchOperationType = React.Dispatch<IFetchOperation | null>;

export interface ISliceOperatorProps {
  fetchOperation: IFetchOperation | null;
  setFetchOperation: SetFetchOperationType;
  sliceOperation: ISliceOperation | null;
  setSliceOperation: SetSliceOperationType;
  itemDimensions: ItemDimensionsRef;
  items: IVirtualListProps['items'];
  loadLimit: number;
  offsetItems: number;
  initialPaddingTop: number;
  itemSpacing: number;
  listState: IListContentProps['listState'];
  setListState: IListContentProps['setListState'];
  hasMoreItems?: boolean;
}

export interface IListOperatorProps {
  list: { entryId: string }[];
  itemDimensions: ItemDimensionsRef;
  scrollState: IScrollState;
  itemSpacing?: number;
  fetchOperation: IFetchOperation | null;
  setFetchOperation: SetFetchOperationType;
  children: (list: { entryId: string }[]) => any;
}

export interface IFetchProcessorProps {
  fetchOperation: IFetchOperation | null;
  items: IVirtualListProps['items'];
  setFetchOperation: SetFetchOperationType;
  itemDimensions: ItemDimensionsRef;
  scrollState: IScrollState;
  offsetItems: number;
  loadLimit: number;
}

export interface IInfiniteScrollState {
  paddingTop: number;
  paddingBottom: number;
  items: IVirtualListProps['items'];
}

export interface IListItemContainerProps {
  itemData: IEntryData | null;
  itemId: string;
  loadItemData: IVirtualListProps['loadItemData'];
  className?: string;
  itemSpacing?: number;
  getItemCard: GetItemCardFn;
  isBookmarked: IRenderItemProps['isBookmarked'];
}
