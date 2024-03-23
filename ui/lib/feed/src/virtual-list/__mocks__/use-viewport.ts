import { Rect } from '../rect';

export const mockScrollToTop = jest.fn();
export const mockIsAtTop = jest.fn(() => true);

const dummyVpRect = new Rect(0, 980);

const useViewport = jest.fn().mockImplementation(() => ({
  scrollToTop: mockScrollToTop,
  isAtTop: mockIsAtTop,
  getRect: jest.fn(() => dummyVpRect),
  resizeRect: jest.fn(),
  scrollBy: jest.fn(),
  getBottomOffset: jest.fn(() => 0),
  getDocumentViewportHeight: jest.fn(() => 500),
  getScrollY: jest.fn(() => 0),
  setTopOffset: jest.fn(),
  setBottomOffset: jest.fn(),
  getRelativeToRootNode: jest.fn(() => dummyVpRect),
}));

export { useViewport };
