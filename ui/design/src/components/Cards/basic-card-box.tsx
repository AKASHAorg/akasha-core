import { Box } from 'grommet';
import * as React from 'react';

const BasicCardBox = ({ children }: any) => (
  <Box
    direction="column"
    elevation="shadow"
    fill={true}
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
