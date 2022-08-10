import * as React from 'react';

import { IProfileData } from '@akashaorg/typings/ui';

import Avatar from '../Avatar';

import { AvatarSize } from '../Avatar/styled-avatar';
import { StyledStackBox, StyledContainer } from './styled-stacked-avatar';

export interface IStackedAvatarProps {
  userData: { ethAddress: string; avatar?: IProfileData['avatar'] }[];
  maxAvatars?: number;
  size?: AvatarSize;
}

const StackedAvatar: React.FC<IStackedAvatarProps> = props => {
  const { userData, maxAvatars, size } = props;
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
          size={size ? size : 'xs'}
          border="sm"
        />
        {level + 1 < data.length && renderStack(level + 1)}
      </StyledStackBox>
    );
  };

  return <StyledContainer>{renderStack(0)}</StyledContainer>;
};

export default StackedAvatar;
