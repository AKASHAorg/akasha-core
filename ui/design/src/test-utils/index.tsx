import { Grommet } from 'grommet';
import React from 'react';
import lightTheme from '../styles/themes/light-theme';

export const wrapWithTheme = (children: any) => {
  return <Grommet theme={lightTheme as any}>{children}</Grommet>;
};

export const delay = (ms = 100) => new Promise(res => setTimeout(res, ms));
