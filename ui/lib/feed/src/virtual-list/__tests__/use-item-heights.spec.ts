import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { useItemHeights, UseItemHeightsProps } from '../use-item-heights';
import { computeAvgItemHeight } from './test-utils';

describe('useItemHeights', () => {
  const defaultProps: UseItemHeightsProps = {
    measurementsCache: new Map(),
    estimatedHeight: 120,
    itemSpacing: 8,
  };

  it('should initialize with default values', () => {
    const { result, unmount } = renderHook(() => useItemHeights(defaultProps));

    expect(result.current.getItemHeightAverage()).toEqual(defaultProps.estimatedHeight);
    expect(result.current.getItemHeights().size).toBe(0);
    unmount();
  });

  it('should update item height correctly', () => {
    const { result, unmount } = renderHook(() => useItemHeights(defaultProps));

    act(() => {
      result.current.updateItemHeight('item1', 60);
    });

    expect(result.current.getItemHeight('item1')).toEqual(60);
    expect(result.current.getItemHeightAverage()).toEqual(computeAvgItemHeight(60, 1, 120));
    unmount();
  });

  it('should compute average item height correctly', () => {
    const { result, unmount } = renderHook(() => useItemHeights(defaultProps));

    act(() => {
      result.current.updateItemHeight('item1', 60);
      result.current.updateItemHeight('item2', 70);
    });

    expect(result.current.getItemHeightAverage()).toEqual(
      computeAvgItemHeight(70, 2, defaultProps.estimatedHeight),
    );
    unmount();
  });

  it('should handle empty measurementsCache', () => {
    const props: UseItemHeightsProps = {
      ...defaultProps,
      measurementsCache: new Map(),
    };

    const { result, unmount } = renderHook(() => useItemHeights(props));

    expect(result.current.getItemHeights().size).toBe(0);
    unmount();
  });
  it('should handle items with the same key', () => {
    const { result, unmount } = renderHook(() => useItemHeights(defaultProps));

    act(() => {
      result.current.updateItemHeight('item1', 60);
      result.current.updateItemHeight('item1', 70);
    });

    expect(result.current.getItemHeights().get('item1')).toBe(70);
    expect(result.current.getItemHeightAverage()).toBeCloseTo(
      computeAvgItemHeight(70, 2, defaultProps.estimatedHeight),
    );
    unmount();
  });
});
