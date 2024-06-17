import { install } from '@twind/core';
import twindConfig from './src/twind/twind.config.js';
import ResizeObserver from 'resize-observer-polyfill';
import '@testing-library/jest-dom';

global.ResizeObserver = ResizeObserver;

install(twindConfig);

jest.mock('@akashaorg/typings/lib/ui', () => ({
  ...jest.requireActual('@akashaorg/typings/lib/ui'),
  NotificationTypes: {
    Info: 'info',
    Alert: 'alert',
    Caution: 'caution',
    Success: 'success',
    Error: 'error',
  },
}));

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
