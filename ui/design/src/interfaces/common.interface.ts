import React, { CSSProperties } from 'react';

export default interface CommonInterface<T> {
  style?: CSSProperties;
  className?: string;
  onClick?: React.EventHandler<React.SyntheticEvent<T, MouseEvent>>;
  onBlur?: () => any;
}
