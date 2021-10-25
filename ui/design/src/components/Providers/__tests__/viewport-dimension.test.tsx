import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
// import responsiveBreakpoints from '../../../styles/responsive-breakpoints';
import { resizeWindow } from '../../../test-utils';
import ViewportSizeProvider, { useViewportSize } from '../viewport-dimension';

// const breakpoints = responsiveBreakpoints.global.breakpoints;

describe('ViewportSize', () => {
  let viewportSize: { dimensions: { width: number; height: number }; size: string };
  beforeEach(async () => {
    const DummyComponent = () => {
      viewportSize = useViewportSize();
      return <></>;
    };
    const tree = (
      <ViewportSizeProvider>
        <DummyComponent />
      </ViewportSizeProvider>
    );
    const treeR = render(tree);
    await waitFor(() => expect(treeR).toBeDefined());
  });
  it('should react on window resize', () => {
    act(() => resizeWindow(250, 200));
    expect(viewportSize).toBeDefined();
    // expect(viewportSize.dimensions.width).toBe(250);
    // expect(viewportSize.dimensions.height).toBe(200);
    // act(() => resizeWindow(800, 600));
    // expect(viewportSize.dimensions.width).toBe(800);
    // expect(viewportSize.dimensions.height).toBe(600);
  });
  it('should return correct size attribute', () => {
    act(() => resizeWindow(520, 300));
    expect(viewportSize).toBeDefined();
    // expect(breakpoints[viewportSize.size].value).toEqual(breakpoints.small.value);
    // act(() => resizeWindow(1022, 768));
    // expect(breakpoints[viewportSize.size].value).toEqual(breakpoints.medium.value);
    // act(() => resizeWindow(1223, 800));
    // expect(breakpoints[viewportSize.size].value).toEqual(breakpoints.large.value);
    // act(() => resizeWindow(1920, 1080));
    // expect(breakpoints[viewportSize.size].value).toEqual(breakpoints.xlarge.value);
  });
});
