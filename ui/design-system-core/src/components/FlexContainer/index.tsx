import * as React from 'react';

export type FlexContainerProps = {};

export const FlexContainer: React.FC<React.PropsWithChildren<FlexContainerProps>> = props => {
  return <div className="flex flex-row">{props.children}</div>;
};
