import React from 'react';
import type { RootComponentProps } from '@akashaorg/typings/lib/ui';
import SimpleEditor from './simple-editor';

const ExampleAppRoot: React.FC<RootComponentProps> = props => {
  return (
    <div>
      <SimpleEditor />
    </div>
  );
};

export default ExampleAppRoot;
