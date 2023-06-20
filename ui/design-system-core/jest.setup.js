require('@testing-library/jest-dom/extend-expect');

import { install } from '@twind/core';
import twindConfig from './src/twind/twind.config.js';
import ResizeObserver from 'resize-observer-polyfill';

global.ResizeObserver = ResizeObserver;

install(twindConfig);

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: () => null,
    disconnect: () => null,
  })),
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
