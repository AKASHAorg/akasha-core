import * as React from 'react';
import { Box } from 'grommet';

import { IProfileData } from '@akashaorg/ui-awf-typings/lib/profile';

import ProfileAvatarButton from '../ProfileAvatarButton';

export interface IChatAreaHeaderProps {
  name: IProfileData['name'];
  avatar: IProfileData['avatar'];
  userName: IProfileData['userName'];
  ethAddress: IProfileData['ethAddress'];
  onClickAvatar?: () => void;
}

const ChatAreaHeader: React.FC<IChatAreaHeaderProps> = props => {
  const { name, avatar, userName, ethAddress, onClickAvatar } = props;

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
        info={userName && `@${userName}`}
        ethAddress={ethAddress}
        avatarImage={avatar}
        onClick={onClickAvatar}
      />
    </Box>
  );
};

export default ChatAreaHeader;
