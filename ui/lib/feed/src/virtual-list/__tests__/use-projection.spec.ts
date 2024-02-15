import { act } from '@testing-library/react';
import { useProjection, UseProjectionProps } from '../use-projection';
import type { VirtualItem } from '../virtual-item-renderer';
import { generateItemList, generateMountedItems } from './test-utils';
import { renderHook } from '@testing-library/react-hooks';
import { Rect } from '../rect';

// jest.mock('../../utils', () => ({
//   getVisibleItemsSlice: jest.fn(),
// }));

const DEFAULT_OVERSCAN = 5;
const DEFAULT_HEIGHT_AVERAGE = 120;

describe('useProjection', () => {
  const mockItems: VirtualItem[] = generateMountedItems(20);
  const mockItemList = generateItemList(20);
  const mockIsAtTop = jest.fn();
  const defaultIsAtTop = mockIsAtTop.mockReturnValue(false);
  const mockProps: UseProjectionProps<unknown> = {
    itemList: mockItemList,
    isInitialPlacement: false,
    isAtTop: defaultIsAtTop,
    getItemHeights: () => new Map(mockItems.map(mit => [mit.key, mit.height])),
    overscan: DEFAULT_OVERSCAN,
    getDistanceFromTop: (itemKey, itemList) => itemList.findIndex(it => it.key === itemKey) * 250,
    getItemHeight: (itemKey: string) => mockItems.find(it => it.key === itemKey).height,
    getItemHeightAverage: () => DEFAULT_HEIGHT_AVERAGE,
  };

  it('should render projections correctly', () => {
    const { result: renderResult } = renderHook(() => useProjection(mockProps));
    expect(
      renderResult.current.getProjection(
        mockItems,
        mockItems.map((it, index) => ({
          key: it.key,
          data: it,
          render: () => null,
          maybeRef: true,
          index,
        })),
      ),
    ).toHaveLength(mockItems.length);
  });

  it('should calculate next projection correctly', () => {
    const { result: renderResult } = renderHook(() => useProjection(mockProps));
    let getNextProjectionResult: ReturnType<typeof renderResult.current.getNextProjection>;
    const startItem: VirtualItem = {
      key: mockItemList[0].key,
      start: 0,
      height: 100,
      visible: false,
      maybeRef: true,
    };

    const viewportRect = new Rect(250, 980);
    const minOffscreenHeight = Math.floor(viewportRect.getHeight() + DEFAULT_HEIGHT_AVERAGE);
    const maxOffscreenHeight = Math.floor(
      viewportRect.getHeight() + DEFAULT_OVERSCAN * DEFAULT_HEIGHT_AVERAGE,
    );

    const expectedMinRect = new Rect(
      viewportRect.getTop() - minOffscreenHeight,
      viewportRect.getHeight() + 2 * minOffscreenHeight,
    );

    const expectedMaxRect = new Rect(
      viewportRect.getTop(),
      viewportRect.getHeight() + 2 * maxOffscreenHeight,
    );

    const alreadyRendered = true;
    act(() => {
      getNextProjectionResult = renderResult.current.getNextProjection(
        startItem,
        viewportRect,
        alreadyRendered,
      );
    });
    expect(getNextProjectionResult.allItems.length).toEqual(mockItemList.length);
    expect(
      getNextProjectionResult.nextRendered[getNextProjectionResult.nextRendered.length - 1].start,
    ).toBeLessThan(expectedMinRect.getHeight());

    const lastIndex = getNextProjectionResult.allItems.findIndex(
      it =>
        it.key ===
        getNextProjectionResult.nextRendered[getNextProjectionResult.nextRendered.length - 1].key,
    );

    expect(getNextProjectionResult.allItems[lastIndex + 1].start).toBeGreaterThanOrEqual(
      expectedMinRect.getBottom(),
    );
    expect(getNextProjectionResult.slice.current).toMatchObject({
      start: 0,
      end: getNextProjectionResult.nextRendered.length,
    });
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
