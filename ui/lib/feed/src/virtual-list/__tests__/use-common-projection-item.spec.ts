import { renderHook } from '@testing-library/react-hooks';
import { useCommonProjectionItem } from '../use-common-projection-item';
import { Rect } from '../rect';
import type { VirtualDataItem, VirtualItem } from '../virtual-item-renderer';
import { createMockProjection, generateItemList, generateMountedItems } from './test-utils';

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
        isInitialPlacement: false,
        stateItems: [],
        viewportRect: dummyRect,
        isAtTop: mockIsAtTop,
        hasPreviousPage: false,
        getProjection: () => [],
        itemList: [],
        getItemHeights: () => new Map(),
        getItemHeight: () => mockEstimatedHeight,
      });
    });
    expect(renderResult.current).toBeUndefined();
    unmount();
  });

  it('should return first itemList when item height is not defined', () => {
    mockIsAtTop.mockReturnValue(false);
    const { result: renderResult, unmount } = renderHook(() => {
      return useCommonProjectionItem({
        isInitialPlacement: false,
        stateItems: [],
        viewportRect: dummyRect,
        isAtTop: mockIsAtTop,
        hasPreviousPage: false,
        getProjection: () => createMockProjection(mockItemList, mockMountedItems),
        itemList: mockItemList,
        getItemHeights: () => new Map(),
        getItemHeight: () => mockEstimatedHeight,
      });
    });
    expect(renderResult.current).toBeDefined();
    expect(renderResult.current.key).toEqual(mockItemList[0].key);
    expect(renderResult.current.start).toEqual(0);
    unmount();
  });

  it('should return first mountedItem (visible) on first render', () => {
    mockIsAtTop.mockReturnValue(true);
    const { result: renderResult, unmount } = renderHook(() =>
      useCommonProjectionItem({
        isInitialPlacement: false,
        stateItems: mockMountedItems,
        viewportRect: dummyRect,
        isAtTop: mockIsAtTop,
        hasPreviousPage: false,
        getProjection: () => createMockProjection(mockItemList, mockMountedItems),
        itemList: mockItemList,
        getItemHeights: () => new Map(mockMountedItems.map(it => [it.key, it.height])),
        getItemHeight: itemKey => mockMountedItems.find(it => it.key === itemKey).height,
      }),
    );

    expect(renderResult.current.key).toEqual(mockMountedItems[0].key);
    expect(renderResult.current.start).toEqual(mockMountedItems[0].start);
    unmount();
  });

  it('should return first mountedItem (visible) when at top', () => {
    mockIsAtTop.mockReturnValue(true);

    const { result: renderResult, unmount } = renderHook(() =>
      useCommonProjectionItem({
        isInitialPlacement: false,
        stateItems: mockMountedItems,
        viewportRect: dummyRect,
        isAtTop: mockIsAtTop,
        hasPreviousPage: false,
        getProjection: () => createMockProjection(mockItemList, mockMountedItems),
        itemList: mockItemList,
        getItemHeights: () => new Map(mockMountedItems.map(it => [it.key, it.height])),
        getItemHeight: itemKey => mockMountedItems.find(it => it.key === itemKey).height,
      }),
    );

    expect(renderResult.current).toEqual({
      ...mockMountedItems[0],
      height: 0,
      maybeRef: false,
      visible: false,
    });
    unmount();
  });

  it('should return first mounted item if no item is visible', () => {
    mockIsAtTop.mockReturnValue(false);
    const { result: renderResult, unmount } = renderHook(() => {
      return useCommonProjectionItem({
        isInitialPlacement: false,
        stateItems: mockMountedItems,
        viewportRect: new Rect(1000, 980),
        isAtTop: mockIsAtTop,
        hasPreviousPage: false,
        getProjection: () => createMockProjection(mockItemList, mockMountedItems),
        itemList: mockItemList,
        getItemHeights: () => new Map(mockMountedItems.map(it => [it.key, it.height])),
        getItemHeight: itemKey => mockMountedItems.find(it => it.key === itemKey).height,
      });
    });

    expect(renderResult.current).toBeDefined();
    unmount();
  });

  it('should return the first visible item when is scrolled', () => {
    mockIsAtTop.mockReturnValue(false);
    const mockedMounted = generateMountedItems(10, 1000);
    const mockedItemList = generateItemList(50);
    const scrolledViewportRect = new Rect(1885, 980);

    const { result: renderResult, unmount } = renderHook(() =>
      useCommonProjectionItem({
        isInitialPlacement: false,
        stateItems: mockMountedItems,
        viewportRect: scrolledViewportRect,
        isAtTop: mockIsAtTop,
        hasPreviousPage: false,
        getProjection: () => createMockProjection(mockedItemList, mockedMounted),
        itemList: mockedItemList,
        getItemHeights: () => new Map(mockedMounted.map(it => [it.key, it.height])),
        getItemHeight: itemKey => mockedMounted.find(it => it.key === itemKey).height,
      }),
    );
    expect(renderResult.current).toBeDefined();
    const item = mockedMounted.find(
      it =>
        it.start <= scrolledViewportRect.getTop() &&
        it.start + it.height >= scrolledViewportRect.getTop(),
    );
    expect(renderResult.current.start).toEqual(item.start);
    expect(renderResult.current.key).toEqual(item.key);
    unmount();
  });
});
