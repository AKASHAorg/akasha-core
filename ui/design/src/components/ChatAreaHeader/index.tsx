import * as React from 'react';
import { Box } from 'grommet';

import ProfileAvatarButton from '../ProfileAvatarButton';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export type IChatAreaHeaderProps = Pick<Profile, 'name' | 'avatar' | 'did'> & {
  onClickAvatar?: () => void;
};

const ChatAreaHeader: React.FC<IChatAreaHeaderProps> = props => {
  const { name, avatar, did, onClickAvatar } = props;

  return (
    <Box
      direction="row"
      width="100%"
      align="center"
      pad="small"
      background="accent"
      round={{ corner: 'top', size: 'small' }}
    >
      <ProfileAvatarButton
        label={name}
        // info={userName && `@${userName}`}
        profileId={did.id}
        avatarImage={avatar}
        onClick={onClickAvatar}
      />
    </Box>
  );
};

export default ChatAreaHeader;
