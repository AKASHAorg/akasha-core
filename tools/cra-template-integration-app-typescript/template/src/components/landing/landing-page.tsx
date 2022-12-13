import React from 'react';
import { Extension } from '@akashaorg/design-system/lib/utils/extension';
import { RootComponentProps } from '@akashaorg/typings/ui';

export const LandingPage: React.FC<RootComponentProps> = props => {
  return (
    <div>
      Landing App
      <Extension name="app-extension" uiEvents={props.uiEvents} />
    </div>
  );
};
