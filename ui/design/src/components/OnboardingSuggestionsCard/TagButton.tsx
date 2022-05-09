import * as React from 'react';
import styled from 'styled-components';
import { Box, Text } from 'grommet';
import Icon from '../Icon';

const StyledBox = styled(Box)`
  cursor: pointer;
  max-width: 150px;
`;

export interface ITagButton {
  tagName: string;
  isSubscribed?: boolean;
  onClickTag?: () => void;
}

export const TagButton: React.FC<ITagButton> = props => {
  const { tagName, isSubscribed, onClickTag } = props;
  return (
    <StyledBox
      border={{ side: 'all', color: 'border', size: 'xsmall' }}
      round="16px"
      align="center"
      justify="center"
      direction="row"
      pad={{ horizontal: 'medium', vertical: 'xsmall' }}
      gap="small"
      background={isSubscribed ? 'accent' : 'cardBackground'}
      onClick={onClickTag}
    >
      <Text color={isSubscribed ? 'white' : null} truncate={true}>
        {tagName}
      </Text>
      <Icon type="subscribe" color={isSubscribed ? 'white' : null} />
    </StyledBox>
  );
};
