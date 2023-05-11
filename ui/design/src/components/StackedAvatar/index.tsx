import * as React from 'react';
import Avatar from '../Avatar';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';
import { AvatarSize } from '../Avatar/styled-avatar';
import { StyledStackBox, StyledContainer } from './styled-stacked-avatar';

export interface IStackedAvatarProps {
  userData: { did: Profile['did']; avatar?: Profile['avatar'] }[];
  maxAvatars?: number;
  size?: AvatarSize;
}

const StackedAvatar: React.FC<IStackedAvatarProps> = props => {
  const { userData, maxAvatars, size } = props;

  const profiles = React.useMemo(() => userData.slice(0, maxAvatars), [userData, maxAvatars]);

  const renderStack = (level: number) => {
    return (
      <StyledStackBox zIndex={level + 1}>
        <Avatar
          // clickable avatars
          onClick={() => {
            /** */
          }}
          profileId={profiles[level].did.id}
          avatar={profiles[level].avatar}
          size={size ? size : 'xs'}
          border="sm"
        />
        {level + 1 < profiles.length && renderStack(level + 1)}
      </StyledStackBox>
    );
  };

  return <StyledContainer>{renderStack(0)}</StyledContainer>;
};

export default StackedAvatar;
