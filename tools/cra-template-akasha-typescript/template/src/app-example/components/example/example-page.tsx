import React from 'react';
import { Extension } from '@akashaorg/design-system/lib/utils/extension';
import { RootComponentProps } from '@akashaorg/typings/ui';

export const ExamplePage: React.FC<RootComponentProps> = props => {
  return (
    <div>
      Example App
      <Extension name="app-extension" uiEvents={props.uiEvents} />
    </div>
  );
};
