export class ResizeObserverMock {
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

const useResizeObserver = jest.fn().mockImplementation(() => ({}));

export { useResizeObserver };
