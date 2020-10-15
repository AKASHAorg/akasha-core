import * as React from 'react';
import { Box } from 'grommet';
import { BasicCardBox } from '../../Cards';

export interface IPlaceholderProps {
  style?: React.CSSProperties;
}
const EntryLoadingPlaceholder: React.FC<IPlaceholderProps> = props => {
  return (
    <BasicCardBox style={{ minHeight: 200, padding: '1em', marginTop: 16, ...props.style }}>
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
