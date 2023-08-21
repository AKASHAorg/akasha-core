import * as React from 'react';
import { tw } from '@twind/core';

import { Profile } from '@akashaorg/typings/ui';

import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';

export type ChatAreaHeaderProps = Pick<Profile, 'name' | 'avatar' | 'did'> & {
  onClickAvatar?: () => void;
};

const ChatAreaHeader: React.FC<ChatAreaHeaderProps> = props => {
  const { name, avatar, did, onClickAvatar } = props;

  return (
    <div
      className={tw(
        `flex flex-row w-full items-center p-2 bg(secondaryLight dark:secondaryDark) rounded-t-lg`,
      )}
    >
      <ProfileAvatarButton
        label={name}
        profileId={did.id}
        avatarImage={avatar}
        onClick={onClickAvatar}
      />
    </div>
  );
};

export default ChatAreaHeader;
