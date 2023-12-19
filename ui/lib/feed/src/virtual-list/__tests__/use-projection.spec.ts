import { act } from '@testing-library/react';
import { useProjection, UseProjectionProps } from '../use-projection';
import type { VirtualItem } from '../virtual-item-renderer';
import { generateItemList, generateMountedItems } from './test-utils';
import { renderHook } from '@testing-library/react-hooks';
import { Rect } from '../rect';

// jest.mock('../../utils', () => ({
//   getVisibleItemsSlice: jest.fn(),
// }));

describe('useProjection', () => {
  const mockItems: VirtualItem[] = generateMountedItems(20);
  const mockItemList = generateItemList(20);
  const mockIsAtTop = jest.fn();
  const defaultIsAtTop = mockIsAtTop.mockReturnValue(false);
  const mockProps: UseProjectionProps<unknown> = {
    mountedItems: mockItems,
    itemList: mockItemList,
    isInitialPlacement: false,
    isAtTop: defaultIsAtTop,
    getItemHeights: () => new Map(mockItems.map(mit => [mit.key, mit.height])),
    overscan: 5,
    getDistanceFromTop: (itemKey, itemList) => itemList.findIndex(it => it.key === itemKey) * 250,
    hasNextPage: true,
    hasPreviousPage: false,
    getItemHeight: (itemKey: string) => mockItems.find(it => it.key === itemKey).height,
    getItemHeightAverage: () => 120,
  };

  it('should render projections correctly', () => {
    const { result: renderResult } = renderHook(() => useProjection(mockProps));
    expect(renderResult.current.projection).toHaveLength(mockItems.length);
  });

  it('should calculate next projection correctly', () => {
    const { result: renderResult } = renderHook(() => useProjection(mockProps));
    let getNextProjectionResult: ReturnType<typeof renderResult.current.getNextProjection>;
    const startItem: VirtualItem = {
      key: 'start-key',
      start: 0,
      height: 100,
      visible: false,
      maybeRef: true,
    };

    const viewportRect = new Rect(250, 980);
    const alreadyRendered = false;
    act(() => {
      getNextProjectionResult = renderResult.current.getNextProjection(
        startItem,
        viewportRect,
        alreadyRendered,
      );
    });

    console.log(getNextProjectionResult);
  });

  it('should calculate projection correction correctly', () => {
    let result: any;

    act(() => {
      renderHook(() => {
        result = useProjection(mockProps);
      });
    });

    const nextRendered: VirtualItem[] = [];

    const listOffset = 50;

    act(() => {
      result.getProjectionCorrection(nextRendered, listOffset);
    });
  });
});
