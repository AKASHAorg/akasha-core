import React from 'react';
import { render } from '@testing-library/react';
import { VirtualItemRenderer, type VirtualItemProps } from '../virtual-item-renderer';

describe('VirtualItemRenderer', () => {
  const animationStartCb = jest.fn();
  const animationEndCb = jest.fn();

  const props: VirtualItemProps<any> = {
    // eslint-disable-next-line unicorn/consistent-function-scoping,@typescript-eslint/no-empty-function
    interfaceRef: (key: string) => (ref: { measureHeight: () => number }) => {},
    resizeObserver: {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      observe: (node: Element | null, callback: (entry: any) => void) => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      unobserve: (node: Element | null) => {},
    },
    item: {
      index: 0,
      maybeRef: true,
      key: 'test-key',
      data: 'test-data',
      render: (data: string) => <div>{data}</div>,
    },
    estimatedHeight: 10,
    onHeightChanged: jest.fn(), // (itemKey: string, newHeight: number) => {},
    itemSpacing: 5,
    transformStyle: 'scale(1, 1)',
    index: 0,
    visible: true,
    isTransition: true,
    onAnimationStart: animationStartCb,
    onAnimationEnd: animationEndCb,
  };

  it('renders correctly', () => {
    const { getByText } = render(<VirtualItemRenderer {...props} />);
    expect(getByText('test-data')).toBeInTheDocument();
  });

  it('sets correct initial styles', () => {
    const { getByText } = render(<VirtualItemRenderer {...props} />);
    const node = getByText('test-data').parentElement;
    expect(node).toHaveStyle('position: absolute');
    expect(node).toHaveStyle('width: 100%');
    expect(node).toHaveStyle('opacity: 1');
    expect(node).toHaveStyle('transform: scale(1, 1)');
  });
});
