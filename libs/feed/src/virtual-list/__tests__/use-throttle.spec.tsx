import * as React from 'react';
import { render, act, fireEvent, screen } from '@testing-library/react';
import { useThrottle } from '../use-throttle';

const TIMEOUT = 500;

describe('useThrottle', () => {
  let mockFn;

  beforeEach(() => {
    jest.useFakeTimers();
    mockFn = jest.fn();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should call the provided function immediately if leading is true', () => {
    render(<MockComponent fn={mockFn} />);
    act(() => {
      fireEvent.click(screen.getByText('Test Button'));
    });
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should not call the provided function immediately if leading is false', () => {
    render(<MockComponent fn={mockFn} leading={false} />);
    act(() => {
      fireEvent.click(screen.getByText('Test Button'));
    });
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should call the provided function after the specified timeout', () => {
    render(<MockComponent fn={mockFn} />);
    act(() => {
      fireEvent.click(screen.getByText('Test Button'));
    });
    jest.advanceTimersByTime(TIMEOUT);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should call the provided function (with trailing) after the specified timeout', () => {
    render(<MockComponent fn={mockFn} leading={false} />);
    act(() => {
      fireEvent.click(screen.getByText('Test Button', { exact: false }));
      fireEvent.click(screen.getByText('Test Button', { exact: false }));
    });
    expect(mockFn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(TIMEOUT);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should not call the provided function on trailing if the component unmounts before the timeout', () => {
    const { unmount } = render(<MockComponent fn={mockFn} leading={false} />);
    act(() => {
      fireEvent.click(screen.getByText('Test Button'));
      unmount();
    });
    jest.advanceTimersByTime(TIMEOUT);
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should call the provided function with trailing invocation after multiple triggers', () => {
    render(<MockComponent fn={mockFn} leading={false} />);
    act(() => {
      fireEvent.click(screen.getByText('Test Button'));
      jest.advanceTimersByTime(200);
      fireEvent.click(screen.getByText('Test Button'));
    });
    jest.advanceTimersByTime(TIMEOUT);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should not call the provided function if trailing is false', () => {
    render(<MockComponent fn={mockFn} trailing={false} leading={false} />);
    act(() => {
      fireEvent.click(screen.getByText('Test Button'));
      fireEvent.click(screen.getByText('Test Button'));
    });
    jest.advanceTimersByTime(TIMEOUT);
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should call on trailing 2 times', () => {
    render(<MockComponent fn={mockFn} trailing={false} timeout={250} />);
    act(() => {
      fireEvent.click(screen.getByText('Test Button'));
      fireEvent.click(screen.getByText('Test Button'));
      jest.advanceTimersByTime(250);
      fireEvent.click(screen.getByText('Test Button'));
      fireEvent.click(screen.getByText('Test Button'));
    });
    jest.advanceTimersByTime(TIMEOUT);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});

const MockComponent = ({ fn, leading = true, trailing = true, timeout = TIMEOUT }) => {
  const throttledFn = useThrottle(fn, timeout, { leading, trailing });

  return (
    <div>
      <button onClick={() => throttledFn(1)}>Test Button</button>
    </div>
  );
};
