import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { useItemHeights, UseItemHeightsProps } from '../use-item-heights';
import { computeAvgItemHeight } from './test-utils';

describe('useItemHeights', () => {
  const defaultProps: UseItemHeightsProps = {
    measurementsCache: new Map(),
    estimatedHeight: 120,
    itemSpacing: 8,
    overscan: 10,
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

  it('should handle item height change with batched updates', () => {
    const { result, unmount } = renderHook(() => useItemHeights(defaultProps));

    act(() => {
      result.current.onItemHeightChange('item1', 60, [], jest.fn());
    });

    expect(result.current.getItemHeights().get('item1')).toBe(60);

    act(() => {
      result.current.onItemHeightChange('item1', 70, [], jest.fn());
    });

    expect(result.current.getItemHeights().get('item1')).toBe(60);

    act(() => {
      result.current.onItemHeightChange('item2', 80, [], jest.fn());
    });

    expect(result.current.getItemHeights().get('item1')).toBe(60);
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
  it('should call updates when batched updates >= overscan', () => {
    const props: UseItemHeightsProps = {
      ...defaultProps,
      overscan: 3,
    };
    const mockUpdateFn = jest.fn();

    const { result, unmount } = renderHook(() => useItemHeights(props));

    result.current.updateItemHeight('item1', 30);
    result.current.updateItemHeight('item2', 35);

    act(() => {
      result.current.onItemHeightChange('item1', 60, [], mockUpdateFn);
      result.current.onItemHeightChange('item2', 70, [], mockUpdateFn);
    });

    expect(result.current.getItemHeights().get('item1')).toBe(30);
    expect(result.current.getItemHeights().get('item2')).toBe(35);
    expect(mockUpdateFn).not.toBeCalled();

    act(() => {
      result.current.onItemHeightChange('item4', 90, [], mockUpdateFn);
    });
    expect(mockUpdateFn).toBeCalledTimes(1);
    unmount();
  });
});
