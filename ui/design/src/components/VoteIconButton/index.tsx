import * as React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon';
import StyledIconButton from '../IconButton/styled-icon-button';

export interface IVoteIconProps {
  className?: string;
  voteType: 'upvote' | 'downvote';
  voteCount: number | string;
  onClick: any;
  voted?: boolean;
}

const StyledVoteIconButton = styled(StyledIconButton)`
  box-sizing: border-box;
`;
const VoteIconButton = (props: IVoteIconProps) => {
  const { className, voteType, voteCount, onClick, voted } = props;
  const iconType = voteType === 'upvote' ? 'thumbsUpWhite' : 'thumbsDownWhite';

  return (
    <StyledVoteIconButton
      className={className}
      reverse={true}
      label={`${voteCount}`}
      icon={<Icon type={iconType} />}
      primary={voted}
      gap="xsmall"
      onClick={onClick}
    />
  );
};

export default VoteIconButton;
