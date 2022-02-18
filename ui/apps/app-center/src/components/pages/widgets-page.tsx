import * as React from 'react';

import DS from '@akashaproject/design-system';

import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { Box } = DS;

const WidgetsPage: React.FC<RootComponentProps> = () => {
  return <Box margin="medium">widgets</Box>;
};

export default WidgetsPage;
