import { IEntryData } from '../Cards/entry-cards/entry-box';

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
  position: 'before' | 'after';
  itemIndex?: number;
  itemId?: string | null;
  getComponent: React.FC<any>;
}
export interface IListInitialState {
  hasNewerEntries: boolean;
  startId: string | null;
}

export type GetItemCardFn = (props: {
  itemId: string;
  itemData: any;
  isBookmarked: boolean | null;
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
  hasMoreItems: boolean;
  bookmarkedItems?: Set<string>;
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
  scrollHeight: number;
  clientHeight: number;
}

export interface IUseScrollStateOptions {
  node: HTMLElement | null;
}

export type ItemDimensions = {
  dimensions: {
    [key: string]: { height: number; top: number };
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
  // the available height (scrolling parent height)
  height: number;
  // the available width of the list
  width: number;
  itemSpacing: number;
  loadLimit: number;
  onLoadMore: IVirtualListProps['loadMore'];
  customEntities: IListCustomEntity[];
  getItemCard: GetItemCardFn;
  listState: {
    startId: string | null;
    hasNewerEntries: boolean;
  };
  setListState: any;
  hasMoreItems: boolean;
  bookmarkedItems?: IVirtualListProps['bookmarkedItems'];
}

export interface IRenderItemProps {
  itemId: string;
  itemData?: any;
  loadItemData: IVirtualListProps['loadItemData'];
  index: number;
  onDimensionChange: (itemId: string, dimension: any) => void;
  itemSpacing?: IListContentProps['itemSpacing'];
  customEntities: IListCustomEntity[];
  getItemCard: GetItemCardFn;
  isBookmarked: boolean | null;
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
  hasMoreItems: boolean;
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
  onDimensionChange: (itemId: string, newDimensions: any) => void;
  itemSpacing?: number;
  getItemCard: GetItemCardFn;
  isBookmarked: IRenderItemProps['isBookmarked'];
}
