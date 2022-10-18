import React from 'react';
import { Box } from 'grommet';

// import Icon from '../Icon';

export interface ISkeletonProps {
  count?: number;
}

const Skeleton: React.FC<ISkeletonProps> = props => {
  const { count = 3 } = props;
  return (
    <Box fill={true} margin={{ top: 'small' }}>
      {[...Array(count).keys()].map(el => (
        <Box key={el} direction="row" align="center" margin={{ bottom: 'small' }}>
          <Box round="100%" width="2.5rem" height="2.5rem" background="border" />
          <Box
            round="0.2rem"
            flex={{ grow: 1 }}
            height="1.5rem"
            background="border"
            margin={{ left: 'small', right: 'xlarge' }}
          />
          {/* <Icon type="dropdown" plain={true} /> */}
        </Box>
      ))}
    </Box>
  );
};

export default Skeleton;
