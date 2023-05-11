import * as React from 'react';
import Avatar from '../Avatar';

import { AvatarSize } from '../Avatar/styled-avatar';
import { StyledStackBox, StyledContainer } from './styled-stacked-avatar';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export interface IStackedAvatarProps {
  userData: { ethAddress: string; avatar?: Profile['avatar'] }[];
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
          // clickable avatars
          onClick={() => {
            /** */
          }}
          ethAddress={data[level].ethAddress}
          src={data[level].avatar.default.src}
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
