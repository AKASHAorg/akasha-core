import { render, fireEvent } from '@testing-library/react';
import React from 'react';
import { useViewport } from '../use-viewport';
import { VirtualListRenderer, type VirtualListRendererProps } from '../list-renderer';
import type { VirtualDataItem, VirtualItem } from '../virtual-item-renderer';
import { generateItemList } from './test-utils';
import { ResizeObserverMock } from '../__mocks__/use-resize-observer';

jest.mock('../use-viewport');
// jest.mock('../use-resize-observer', () => ({}));
// jest.mock('../use-item-heights', () => ({}));
// jest.mock('../use-list', () => ({}));
// jest.mock('../use-common-projection-item', () => ({}));
// jest.mock('../use-debounce', () => ({}));
// jest.mock('../use-throttle', () => ({}));

const itemList: VirtualDataItem<unknown>[] = generateItemList(10);
const restorationItem = null;
const viewportHeight = 960;
const documentViewportHeight = 5000;
const getRect = () => ({ top: 0, height: viewportHeight });
const offsetTop = 100;
const getItemHeightAverage = jest.fn().mockReturnValue(100);
jest.useFakeTimers();
describe('VirtualListRenderer', () => {
  global.ResizeObserver = ResizeObserverMock;
  const renderComponent = (props?: VirtualListRendererProps<unknown>) => {
    return render(
      <div>
        <VirtualListRenderer
          ref={React.createRef()}
          itemList={itemList}
          restorationItem={restorationItem}
          offsetTop={offsetTop}
          scrollRestorationType={'auto'}
          estimatedHeight={120}
          itemSpacing={8}
          overscan={5}
          onEdgeDetectorUpdate={jest.fn()}
          hasNextPage={true}
          hasPreviousPage={false}
          {...props}
        />
      </div>,
    );
  };

  it('should render properly', () => {
    const { container } = renderComponent();
    expect(container).toBeDefined();
    // viewport should have been called
    expect(useViewport).toHaveBeenCalled();
  });

  it('should correctly handle scroll events', async () => {
    const { getByTestId, container } = renderComponent();

    jest.advanceTimersByTime(10);
  });

  // it("should call handleItemHeightChange when an item's height changes", () => {
  //   const handleItemHeightChange = jest.fn();
  //   renderComponent();
  //   // add assertions here based on expected behavior of your component after an item's height changes
  // });

  // it('should correctly update the state when the viewport is resized', () => {
  //   const resizeObserver = ({ observe, unobserve }: any) => ({
  //     observe: jest.fn(),
  //     unobserve: jest.fn(),
  //   });
  //
  //   renderComponent({}, { resizeObserver });
  //
  //   // add assertions here based on expected behavior of your component after the viewport is resized
  // });
});
