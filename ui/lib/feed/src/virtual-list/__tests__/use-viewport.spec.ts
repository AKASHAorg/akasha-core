import { renderHook } from '@testing-library/react-hooks';
import { UseViewportProps, useViewport } from '../use-viewport';
import { Rect } from '../rect';

describe('useViewport', () => {
  beforeEach(() => {
    global.scrollTo = jest.fn();
  });
  it('returns correct initial state', () => {
    const initialRect = new Rect(0, 100);
    const offsetTop = 50;
    const props: UseViewportProps = { initialRect, offsetTop };

    const { result } = renderHook(() => useViewport(props));

    expect(result.current.state).toEqual({
      rect: initialRect,
      offsetTop: offsetTop,
    });
    expect(result.current.getRect().getTop()).toBe(0);
    expect(result.current.getRect().getHeight()).toBe(100);
  });

  it('calls `resizeRect` correctly', () => {
    const initialRect = new Rect(0, 100);
    const offsetTop = 50;
    const props: UseViewportProps = { initialRect, offsetTop };

    const { result } = renderHook(() => useViewport(props));

    // Update rect
    const newTop = 10;
    const newHeight = 200;
    result.current.resizeRect(newTop, newHeight);

    expect(result.current.getRect().getTop()).toBe(newTop);
    expect(result.current.getRect().getHeight()).toBe(newHeight);
  });

  it('sets and gets offset values correctly', () => {
    const initialRect = new Rect(0, 100);
    const offsetTop = 50;
    const props: UseViewportProps = { initialRect, offsetTop };

    const { result } = renderHook(() => useViewport(props));

    // Set and get top offset
    const topOffset = 30;
    result.current.setTopOffset(topOffset);
    expect(result.current.getTopOffset()).toBe(topOffset);

    // Set and get bottom offset
    const bottomOffset = 70;
    result.current.setBottomOffset(bottomOffset);
    expect(result.current.getBottomOffset()).toBe(bottomOffset);
  });
});
