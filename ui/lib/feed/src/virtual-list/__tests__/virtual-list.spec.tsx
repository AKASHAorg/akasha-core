import * as React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Virtualizer, VirtualizerProps } from '../index';
import '@testing-library/jest-dom';
import { act } from '@testing-library/react-hooks';
import * as commonProjectionHook from '../use-common-projection-item';
import { generateMountedItems } from './test-utils';

class ResizeObserver {
  observe() {
    return;
  }
  unobserve() {
    return;
  }
  disconnect() {
    return;
  }
}
const restorationKey = 'test-restoration-key';
describe('Virtualizer', () => {
  global.ResizeObserver = ResizeObserver;
  const mockEdgeDetectorChangeFn = jest.fn();
  const mockProps: VirtualizerProps<string> = {
    restorationKey,
    header: <div>Header</div>,
    footer: <div>Footer</div>,
    estimatedHeight: 100,
    items: [],
    itemKeyExtractor: item => item,
    itemIndexExtractor: item => parseInt(item.split(' ')[1]),
    renderItem: item => <div>{item}</div>,
    overscan: 20,
    itemSpacing: 8,
    onFetchInitialData: jest.fn(),
    onEdgeDetectorChange: mockEdgeDetectorChangeFn,
    hasNextPage: false,
    hasPreviousPage: false,
    isLoading: false,
  };
  let rendered;
  const mockCommonItem = generateMountedItems(1)[0];
  const mockCommonProjectionFn = jest.fn(() => mockCommonItem);
  beforeEach(() => {
    global.scrollTo = jest.fn();
    global.scrollBy = jest.fn();
    jest.mock('../use-viewport', () => ({
      useViewport: jest.fn(() => ({
        getDocumentViewportHeight: jest.fn(() => 500),
        getRect: jest.fn(() => ({ getHeight: jest.fn(() => 500) })),
        scrollToTop: jest.fn(),
        getScrollY: jest.fn(() => 0),
        scrollBy: jest.fn(),
        setTopOffset: jest.fn(),
        setBottomOffset: jest.fn(),
      })),
    }));
    (
      jest.spyOn(
        commonProjectionHook,
        'useCommonProjectionItem',
      ) as unknown as jest.SpyInstance<jest.Mock>
    ).mockReturnValue(mockCommonProjectionFn);

    rendered = render(<Virtualizer {...mockProps} />);
  });
  afterEach(() => {
    jest.clearAllMocks();
    global.scrollTo(0, 0);
    rendered = undefined;
  });
  it('renders container on first render', () => {
    const { container } = rendered;

    expect(container.querySelector(`#${restorationKey}`)).toBeInTheDocument();
    // header + footer
    expect(container.querySelector(`#${restorationKey}`).childElementCount).toEqual(2);
  });

  it('calls onFetchInitialData if itemList is empty', () => {
    const { rerender } = rendered;
    rerender(<Virtualizer {...{ ...mockProps, items: [] }} />);
    expect(mockProps.onFetchInitialData).toBeCalledTimes(1);
  });

  it('it sets the state on update and calls the callback function (and update)', async () => {
    jest.useFakeTimers();

    act(() => {
      fireEvent.scroll(window, { target: { clientY: 458 } });
      jest.advanceTimersByTime(500);
    });

    expect(mockCommonProjectionFn).toHaveBeenCalled();
    expect(mockEdgeDetectorChangeFn).toHaveBeenCalled();
  });
});
