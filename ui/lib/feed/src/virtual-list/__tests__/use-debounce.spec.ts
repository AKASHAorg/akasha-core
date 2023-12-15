import { renderHook, act } from '@testing-library/react-hooks';
import { useDebounce } from '../use-debounce';

describe('useDebounce', () => {
  jest.useFakeTimers();

  it('should call the function after the specified delay', () => {
    const callback = jest.fn();
    const delay = 500;
    const { result } = renderHook(() => useDebounce(callback, delay));

    act(() => {
      result.current('test');
    });

    expect(callback).toHaveBeenCalledTimes(0);

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test');
  });

  it('should not call the function if delay is not over', () => {
    const callback = jest.fn();
    const delay = 500;
    const { result } = renderHook(() => useDebounce(callback, delay));

    act(() => {
      result.current('test');
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(delay - 100);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test');
  });

  it('should only call the function once if debounced multiple times within delay', () => {
    const callback = jest.fn();
    const delay = 500;
    const { result } = renderHook(() => useDebounce(callback, delay));

    act(() => {
      result.current('test1');
      result.current('test2');
      result.current('test3');
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(delay);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test3');
  });
});
