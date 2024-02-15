import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useList } from '../use-list';
import { generateItemList, generateMountedItems, getRelativeRectToRootNode } from './test-utils';
import { Rect } from '../rect';
import { render } from '@testing-library/react';

const mockItemList = generateItemList(10);

const mockViewportRect = new Rect(0, 1000);

const mockProps = {
  documentViewportHeight: 1000,
  viewportHeight: 300,
  viewportBottomOffset: 50,
  getItemDistanceFromTop: jest.fn(),
  itemList: mockItemList,
};

const MockComponent = ({ height }) => {
  return (
    <div style={{ height: `${height}px`, background: 'white' }}>
      {mockItemList.map(it => (
        <div key={it.key} style={{ height: 150 }}></div>
      ))}
    </div>
  );
};

const mockGetBoundingClientRect = jest.fn(() => ({
  height: 0,
  width: 0,
  top: 450,
  bottom: 0,
  left: 0,
  right: 0,
  x: 0,
  y: 0,
  toJSON: jest.fn(),
}));

describe('useList hook', () => {
  it('computes viewportRect relative to root node', async () => {
    const { container } = render(<MockComponent height={850} />);
    const element = container.firstElementChild as HTMLElement;

    HTMLElement.prototype.getBoundingClientRect = mockGetBoundingClientRect;
    const relativeRect = getRelativeRectToRootNode(mockViewportRect, {
      current: element,
    });
    expect(relativeRect.getTop()).toEqual(-mockGetBoundingClientRect().top);
    expect(relativeRect.getHeight()).toEqual(mockViewportRect.getHeight());
  });

  it('calculates top padding correctly', () => {
    const { result } = renderHook(() => useList(mockProps));

    const items = generateMountedItems(10);
    const padding = result.current.getListTopPadding(items, mockViewportRect);

    expect(padding).toBe(0);
  });

  it.skip('calculates bottom padding correctly', () => {
    const { result } = renderHook(() => useList(mockProps));

    const items = generateMountedItems(10);
    const bottomPadding = result.current.getListBottomPadding(items, mockViewportRect);

    expect(bottomPadding).toBe(0);
  });

  it.skip('calculates list padding correctly', () => {
    const { result } = renderHook(() => useList(mockProps));

    const items = generateMountedItems(5);
    const listPadding = result.current.getListPadding(items, mockViewportRect);

    expect(listPadding).toBe(0);
  });

  it.skip('calculates list offset correctly', () => {
    const { result } = renderHook(() => useList(mockProps));

    const projectionItem = generateMountedItems(1)[0];
    const offset = result.current.getListOffset(projectionItem);

    expect(offset).toBe(0);
  });

  it.skip('checks for correction correctly', () => {
    const { result } = renderHook(() => useList(mockProps));

    const projectionItem = generateMountedItems(1)[0];
    const hasCorrection = result.current.hasCorrection(projectionItem);

    expect(hasCorrection).toBe(0);
  });
});
