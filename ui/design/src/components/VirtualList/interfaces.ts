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
  itemCard: React.ReactElement;
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
  hasMoreItems?: boolean;
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

export interface IRenderItemProps {
  itemId: string;
  itemData?: any;
  loadItemData: IVirtualListProps['loadItemData'];
  onSizeChange: (itemId: string, rect: { top: number; height: number }) => void;
  itemSpacing: IVirtualListProps['itemSpacing'];
  customEntities: IListCustomEntity[];
  itemCard: IVirtualListProps['itemCard'];
  coordinates: { [key: string]: { top: number; height: number } };
}

export type SetSliceOperationType = React.Dispatch<React.SetStateAction<ISliceOperation>>;
export type SetFetchOperationType = React.Dispatch<IFetchOperation | null>;
