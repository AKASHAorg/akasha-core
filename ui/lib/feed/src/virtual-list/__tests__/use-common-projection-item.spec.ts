import { renderHook, act } from '@testing-library/react-hooks';
import { useCommonProjectionItem } from '../use-common-projection-item';
import { Rect } from '../rect';
import type { MountedItem } from '../use-projection';
import type { VirtualDataItem, VirtualItem } from '../virtual-item-renderer';

const createMockProjection = (itemList, mountedItems) => {
  return mountedItems.reduce((acc, mountedItem) => {
    const itemData = itemList.find(it => it.key === mountedItem.key);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key, ...rest } = mountedItem;
    if (itemData) {
      acc.push({
        ...rest,
        virtualData: itemData,
      });
    }
    return acc;
  }, [] as MountedItem<unknown>[]);
};
const generateItemList = (count: number): VirtualDataItem<unknown>[] => {
  return Array.from({ length: count }, (_, num: number) => ({
    key: `item-${num}`,
    index: num,
    maybeRef: true,
    data: {},
    render: () => null,
  }));
};
const generateMountedItems = (count: number, startOffset = 0): VirtualItem[] => {
  return Array.from({ length: count }, (_, num: number) => ({
    key: `item-${num}`,
    maybeRef: true,
    height: 250,
    start: num * 250 + startOffset,
    visible: true,
  }));
};

describe('useCommonProjectionItem', () => {
  const dummyRect = new Rect(0, 980);
  const mockIsAtTop = jest.fn();
  const mockItemList: VirtualDataItem<unknown>[] = generateItemList(10);
  const mockMountedItems: VirtualItem[] = generateMountedItems(7);
  const mockEstimatedHeight = 120;

  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should return undefined on first render with no prev page', () => {
    mockIsAtTop.mockReturnValue(true);
    const { result: renderResult, unmount } = renderHook(() => {
      return useCommonProjectionItem({
        isAtTop: mockIsAtTop,
        hasPreviousPage: false,
        projection: [],
        itemList: [],
        getItemHeights: () => new Map(),
        getItemHeight: () => mockEstimatedHeight,
      });
    });
    const result = renderResult.current(new Rect(500, 980), true);
    expect(result).toBeUndefined();
    unmount();
  });

  it('should return first itemList when item height is not defined', () => {
    mockIsAtTop.mockReturnValue(false);
    const { result: renderResult, unmount } = renderHook(() => {
      return useCommonProjectionItem({
        isAtTop: mockIsAtTop,
        hasPreviousPage: false,
        projection: createMockProjection(mockItemList, mockMountedItems),
        itemList: mockItemList,
        getItemHeights: () => new Map(),
        getItemHeight: () => mockEstimatedHeight,
      });
    });
    const result = renderResult.current(new Rect(500, 980), false);
    expect(result).toBeDefined();
    expect(result.key).toEqual(mockItemList[0].key);
    expect(result.start).toEqual(0);
    unmount();
  });

  it('should return first mountedItem (visible) on first render', () => {
    mockIsAtTop.mockReturnValue(true);
    const { result: renderResult, unmount } = renderHook(() =>
      useCommonProjectionItem({
        isAtTop: mockIsAtTop,
        hasPreviousPage: false,
        projection: createMockProjection(mockItemList, mockMountedItems),
        itemList: mockItemList,
        getItemHeights: () => new Map(mockMountedItems.map(it => [it.key, it.height])),
        getItemHeight: itemKey => mockMountedItems.find(it => it.key === itemKey).height,
      }),
    );

    const result = renderResult.current(dummyRect, true);

    expect(result.key).toEqual(mockMountedItems[0].key);
    expect(result.start).toEqual(mockMountedItems[0].start);
    unmount();
  });

  it('should return first mountedItem (visible) when at top', () => {
    mockIsAtTop.mockReturnValue(true);

    const { result: renderResult, unmount } = renderHook(() =>
      useCommonProjectionItem({
        isAtTop: mockIsAtTop,
        hasPreviousPage: false,
        projection: createMockProjection(mockItemList, mockMountedItems),
        itemList: mockItemList,
        getItemHeights: () => new Map(mockMountedItems.map(it => [it.key, it.height])),
        getItemHeight: itemKey => mockMountedItems.find(it => it.key === itemKey).height,
      }),
    );

    const result = renderResult.current(dummyRect, false);

    expect(result).toEqual({ ...mockMountedItems[0], height: 0, maybeRef: false, visible: false });
    unmount();
  });

  it('should return first mounted item if no item is visible', () => {
    mockIsAtTop.mockReturnValue(false);
    const { result: renderResult, unmount } = renderHook(() => {
      return useCommonProjectionItem({
        isAtTop: mockIsAtTop,
        hasPreviousPage: false,
        projection: createMockProjection(mockItemList, mockMountedItems),
        itemList: mockItemList,
        getItemHeights: () => new Map(mockMountedItems.map(it => [it.key, it.height])),
        getItemHeight: itemKey => mockMountedItems.find(it => it.key === itemKey).height,
      });
    });
    const result = renderResult.current(new Rect(1000, 980), false);
    expect(result).toBeDefined();
    unmount();
  });

  it('should return the first visible item when is scrolled', () => {
    mockIsAtTop.mockReturnValue(false);
    const mockedMounted = generateMountedItems(10, 1000);
    const mockedItemList = generateItemList(50);

    const { result: renderResult, unmount } = renderHook(() =>
      useCommonProjectionItem({
        isAtTop: mockIsAtTop,
        hasPreviousPage: false,
        projection: createMockProjection(mockedItemList, mockedMounted),
        itemList: mockedItemList,
        getItemHeights: () => new Map(mockedMounted.map(it => [it.key, it.height])),
        getItemHeight: itemKey => mockedMounted.find(it => it.key === itemKey).height,
      }),
    );
    const viewportRect = new Rect(1885, 980);
    const result = renderResult.current(viewportRect, false);
    expect(result).toBeDefined();
    const item = mockedMounted.find(
      it => it.start <= viewportRect.getTop() && it.start + it.height >= viewportRect.getTop(),
    );
    expect(result.start).toEqual(item.start);
    expect(result.key).toEqual(item.key);
    unmount();
  });
});
