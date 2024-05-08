import { useEdgeDetector, EdgeArea } from '../use-edge-detector';
import { Rect } from '../rect';
import { VirtualItem } from '../virtual-item-renderer';
import { renderHook, act } from '@testing-library/react-hooks';

describe('useEdgeDetector', () => {
  it('tests useEdgeDetector hook', () => {
    const rect: Rect = new Rect(0, 100);
    const item: VirtualItem = {
      start: 10,
      height: 150,
      visible: true,
      maybeRef: false,
      key: 'abc-key',
    };
    const items: VirtualItem[] = [item, item, item];
    const onEdgeDetectorChange = jest.fn();
    const { result } = renderHook(() =>
      useEdgeDetector({
        overscan: 5,
        onEdgeDetectorChange,
      }),
    );

    act(() => {
      result.current.update(items, items, rect, () => 50, true);
    });

    expect(onEdgeDetectorChange).toBeCalledWith(EdgeArea.TOP);
  });
});
