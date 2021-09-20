import React from 'react';
import { Box } from 'grommet';

import { TextLine } from '../VirtualList/placeholders/entry-card-placeholder';

interface IListLoading {
  type: 'profile' | 'topic';
}

const ListLoading: React.FC<IListLoading> = props => {
  const { type } = props;

  return (
    <Box pad={{ top: 'large' }} gap="medium">
      {type === 'topic' &&
        Array.from({ length: 9 }, (_el, index) => (
          <Box key={index} direction="row" justify="between" align="center">
            <Box gap="xxsmall">
              <TextLine title="tagName" animated={false} width="140px" />
              <TextLine title="tagName" animated={false} width="80px" />
            </Box>
            <TextLine title="tagName" animated={false} width="7rem" height="2rem" />
          </Box>
        ))}
      {type === 'profile' &&
        Array.from({ length: 9 }, (_el, index) => (
          <Box key={index} direction="row" justify="between" align="center">
            <Box direction="row" gap="xsmall">
              <TextLine title="avatar" width="40px" height="40px" round={{ size: '50%' }} />
              <Box gap="xxsmall">
                <TextLine title="tagName" animated={false} width="140px" />
                <TextLine title="tagName" animated={false} width="80px" />
              </Box>
            </Box>
            <TextLine title="tagName" animated={false} width="7rem" height="2rem" />
          </Box>
        ))}
    </Box>
  );
};

export default ListLoading;
