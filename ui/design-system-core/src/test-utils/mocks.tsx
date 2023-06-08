export const intersectionObserverMock = () => ({
  observe: () => null,
  disconnect: () => null,
});

export const matchMediaMock = query => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});
