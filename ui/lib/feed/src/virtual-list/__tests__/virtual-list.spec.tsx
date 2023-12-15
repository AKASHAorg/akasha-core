import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Virtualizer, VirtualizerProps } from '../index';
import '@testing-library/jest-dom';

const generateItems = (n: number) => Array.from({ length: n }, (_, i) => `Item ${i}`);
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
describe('Virtualizer', () => {
  global.ResizeObserver = ResizeObserver;
  const mockProps: VirtualizerProps<string> = {
    restorationKey: 'restoration-key',
    header: <div>Header</div>,
    footer: <div>Footer</div>,
    estimatedHeight: 100,
    items: generateItems(20),
    itemKeyExtractor: item => item,
    itemIndexExtractor: item => parseInt(item.split(' ')[1]),
    renderItem: item => <div>{item}</div>,
    overscan: 20,
    itemSpacing: 8,
    onFetchInitialData: jest.fn(),
    onEdgeDetectorChange: jest.fn(),
    hasNextPage: false,
    hasPreviousPage: false,
    isLoading: false,
  };
  beforeEach(() => {
    global.scrollTo = jest.fn();
  });
  it('renders correctly with default props', () => {
    const { getByText, container } = render(<Virtualizer {...mockProps} />);

    // Check if header is rendered correctly
    expect(getByText('Header')).toBeInTheDocument();

    expect(container.querySelector('#restoration-key').childElementCount).toEqual(19);
  });

  it.skip('calls onFetchInitialData if itemList is empty', () => {
    const { rerender } = render(<Virtualizer {...mockProps} items={[]} />);

    rerender(<Virtualizer items={[]} {...mockProps} />);

    expect(mockProps.onFetchInitialData).toHaveBeenCalled();
  });

  it('edge detection works flawlessly', () => {
    const { container } = render(<Virtualizer {...mockProps} />);

    const listElement = container.querySelector('#restoration-key');

    fireEvent.scroll(listElement, { target: { scrollTop: 1000 } });

    expect(mockProps.onEdgeDetectorChange).toHaveBeenCalled();
  });
});
