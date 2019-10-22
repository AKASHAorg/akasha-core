import * as React from 'react';
import { Box } from 'grommet';

const BasicCardBox = ({ children }: any) => (
  <Box
    direction="column"
    elevation="shadow"
    fill
    pad="none"
    round="xsmall"
    border={{
      color: 'border',
      size: 'xsmall',
      style: 'solid',
      side: 'all',
    }}
  >
    {children}
  </Box>
);

export default BasicCardBox;
