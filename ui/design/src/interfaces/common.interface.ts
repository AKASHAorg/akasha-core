import React, { CSSProperties } from 'react';
import { StyledComponent } from 'styled-components';

export { StyledComponent };

declare module 'styled-components' {
  export interface ThemedStyledComponentsModule<T> {
    createGlobalStyle(strings: TemplateStringsArray): React.ComponentClass;
  }

  export function createGlobalStyle(strings: TemplateStringsArray): React.ComponentClass;
}

export default interface CommonInterface<T> {
  style?: CSSProperties;
  className?: string;
  onClick?: React.EventHandler<React.SyntheticEvent<T, MouseEvent>>;
  onBlur?: () => any;
}
