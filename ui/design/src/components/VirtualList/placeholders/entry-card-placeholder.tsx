import * as React from 'react';
import { Box } from 'grommet';
import { BasicCardBox } from '../../Cards';

export interface IPlaceholderProps {
  style?: React.CSSProperties;
  height?: number;
}
const EntryLoadingPlaceholder: React.FC<IPlaceholderProps> = props => {
  const { height = 200 } = props;
  return (
    <BasicCardBox style={{ minHeight: height, padding: '1em', ...props.style }}>
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
              style={{ width: 220, minHeight: 18, backgroundColor: '#dadada' }}
            />
            <div
              title="entry-publish-date"
              style={{ width: 160, minHeight: 10, backgroundColor: '#dadada', marginTop: 4 }}
            />
          </Box>
        </Box>
      </Box>
      <Box direction="column" />
    </BasicCardBox>
  );
};

export default EntryLoadingPlaceholder;
