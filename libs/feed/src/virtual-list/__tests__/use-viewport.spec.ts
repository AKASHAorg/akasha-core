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
    const offsetBottom = 0;
    const props: UseViewportProps = { initialRect, offsetTop, offsetBottom };

    const { result } = renderHook(() => useViewport(props));

    expect(result.current.state).toEqual({
      rect: initialRect,
      offsetTop: offsetTop,
      offsetBottom: offsetBottom,
    });

    expect(result.current.state.rect.getTop()).toBe(0);
    expect(result.current.state.rect.getHeight()).toBe(100);
  });

  it('calls `resizeRect` correctly', () => {
    const initialRect = new Rect(0, 100);
    const offsetTop = 50;
    const offsetBottom = 0;
    const props: UseViewportProps = { initialRect, offsetTop, offsetBottom };

    const { result } = renderHook(() => useViewport(props));

    const newTop = 10;
    const newHeight = 200;
    result.current.resizeRect(newTop, newHeight);

    expect(result.current.state.rect.getTop()).toBe(newTop);
    expect(result.current.state.rect.getHeight()).toBe(newHeight);
  });

  it('sets and gets offset values correctly', () => {
    const initialRect = new Rect(0, 100);
    const offsetTop = 50;
    const offsetBottom = 0;
    const props: UseViewportProps = { initialRect, offsetTop, offsetBottom };

    const { result } = renderHook(() => useViewport(props));

    const topOffset = 30;
    result.current.setTopOffset(topOffset);
    expect(result.current.getTopOffset()).toBe(topOffset);

    const bottomOffset = 70;
    result.current.setBottomOffset(bottomOffset);
    expect(result.current.getBottomOffset()).toBe(bottomOffset);
  });
});
