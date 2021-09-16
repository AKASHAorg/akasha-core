import React from 'react';
import { Box } from 'grommet';

import { TextLine } from '../VirtualList/placeholders/entry-card-placeholder';

interface IListLoading {
  type: 'profile' | 'topic';
}

const ListLoading: React.FC<IListLoading> = props => {
  const { type } = props;

  const iterateArr = [...Array(9).keys()];

  return (
    <Box pad={{ top: 'large' }} gap="medium">
      {type === 'topic' &&
        iterateArr.map((_el, index: number) => (
          <Box key={index} direction="row" justify="between" align="center">
            <Box gap="xxsmall">
              <TextLine title="tagName" animated={false} width="140px" />
              <TextLine title="tagName" animated={false} width="80px" />
            </Box>
            <TextLine title="tagName" animated={false} width="7rem" height="2rem" />
          </Box>
        ))}
      {type === 'profile' &&
        iterateArr.map((_el, index: number) => (
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
