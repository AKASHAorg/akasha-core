import { fireEvent, queries, render } from '@testing-library/react';
import React, { ReactElement } from 'react';

export const wrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const delay = (ms = 100) => new Promise(res => setTimeout(res, ms));

export const customRender = (ui: ReactElement, options: Record<string, unknown>) =>
  render(ui, { wrapper, queries: { ...queries }, ...options });

export const resizeWindow = (width: number, height: number) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.innerWidth = width;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.innerHeight = height;
  fireEvent(window, new Event('resize'));
};

export const createFile = (name: string, type = 'image/png') => {
  return new File(['test-file-content'], name, { type });
};
