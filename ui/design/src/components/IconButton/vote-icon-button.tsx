import * as React from 'react';
import styled, { css } from 'styled-components';
import Icon from '../Icon';
import StyledIconButton from './styled-icon-button';

interface IVoteIconProps {
  voteType: 'upvote' | 'downvote';
  voteCount: number;
  onClick: () => void;
  voted?: boolean;
}

const StyledVoteIconButton = styled(StyledIconButton)`
  box-sizing: border-box;
`;
const VoteIconButton = (props: IVoteIconProps) => {
  const { voteType, voteCount, onClick, voted } = props;
  const iconType = voteType === 'upvote' ? 'arrowUp' : 'arrowDown';

  return (
    <StyledVoteIconButton
      reverse={true}
      label={`${voteCount}`}
      icon={<Icon type={iconType} />}
      primary={voted}
      gap="xsmall"
    />
  );
};

export default VoteIconButton;
