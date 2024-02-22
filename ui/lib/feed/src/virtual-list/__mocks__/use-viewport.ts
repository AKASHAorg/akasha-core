export const mockScrollToTop = jest.fn();
export const mockIsAtTop = jest.fn(() => true);

const useViewport = jest.fn().mockImplementation(() => ({
  scrollToTop: mockScrollToTop,
  isAtTop: mockIsAtTop,
  getRect: jest.fn(() => ({ getTop: () => 0, getHeight: () => 500 })),
  resizeRect: jest.fn(),
  scrollBy: jest.fn(),
  getBottomOffset: jest.fn(() => 0),
  getDocumentViewportHeight: jest.fn(() => 500),
  getScrollY: jest.fn(() => 0),
  setTopOffset: jest.fn(),
  setBottomOffset: jest.fn(),
  getRelativeToRootNode: jest.fn(() => ({ getTop: () => 0, getHeight: () => 500 })),
}));

export { useViewport };
