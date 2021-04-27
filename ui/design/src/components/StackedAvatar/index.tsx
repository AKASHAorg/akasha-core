/* eslint-disable */
import * as React from 'react';
import Avatar from '../Avatar';
import { StyledStackBox, StyledContainer } from './styled-stacked-avatar';

export interface IStackedAvatarProps {
  userData: { ethAddress: string; avatar?: string }[];
  maxAvatars?: number;
}

const StackedAvatar: React.FC<IStackedAvatarProps> = props => {
  const { userData, maxAvatars } = props;
  let data = userData;
  if (maxAvatars) {
    data = userData.slice(0, maxAvatars);
  }

  const renderStack = (level: number) => {
    return (
      <StyledStackBox zIndex={level + 1}>
        <Avatar
          ethAddress={data[level].ethAddress}
          src={data[level].avatar}
          size="xs"
          border="sm"
        />
        {level + 1 < data.length && renderStack(level + 1)}
      </StyledStackBox>
    );
  };

  return <StyledContainer>{renderStack(0)}</StyledContainer>;
};

export default StackedAvatar;
