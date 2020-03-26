import * as React from 'react';
import { Box } from 'grommet';
import { BasicCardBox } from '../../Cards';

const EntryLoadingPlaceholder = () => {
  return (
    <BasicCardBox style={{ minHeight: 200, padding: '1em' }}>
      <Box direction="row">
        <Box direction="row" align="center">
          <Box>
            <div
              title="avatar"
              style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#dadada' }}
            />
          </Box>
          <Box direction="column" margin={{ left: '8px' }}>
            <div
              title="author name"
              style={{ width: 220, minHeight: 25, backgroundColor: '#dadada' }}
            />
            <div
              title="entry-publish-date"
              style={{ width: 160, minHeight: 15, backgroundColor: '#dadada', marginTop: 4 }}
            />
          </Box>
        </Box>
      </Box>
      <Box direction="column" />
    </BasicCardBox>
  );
};

export default EntryLoadingPlaceholder;
