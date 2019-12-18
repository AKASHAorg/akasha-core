import { queries, render } from '@testing-library/react';
import { Grommet, ThemeType } from 'grommet';
import React, { ReactElement } from 'react';
import lightTheme from '../styles/themes/light-theme';

export const wrapWithTheme = (children: any) => {
  return <Grommet theme={lightTheme as ThemeType}>{children}</Grommet>;
};

export const WithProviders = ({ children }: { children: any }) => {
  return <Grommet theme={lightTheme as ThemeType}>{children}</Grommet>;
};

export const delay = (ms = 100) => new Promise(res => setTimeout(res, ms));

export const customRender = (ui: ReactElement, options: any) =>
  render(ui, { wrapper: WithProviders, queries: { ...queries }, ...options });

export const createFile = (name: string, type: string = 'image/png') => {
  return new File(['test-file-content'], name, { type });
};