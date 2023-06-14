import * as React from 'react';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import { Profile } from '@akashaorg/typings/ui';
import { tw } from '@twind/core';

export type IChatAreaHeaderProps = Pick<Profile, 'name' | 'avatar' | 'did'> & {
  onClickAvatar?: () => void;
};

const ChatAreaHeader: React.FC<IChatAreaHeaderProps> = props => {
  const { name, avatar, did, onClickAvatar } = props;

  return (
    <div
      className={tw(
        `flex flex-row w-full items-center p-2 bg(secondaryLight dark:secondaryDark) rounded-t-lg`,
      )}
    >
      <ProfileAvatarButton
        label={name}
        // info={userName && `@${userName}`}
        profileId={did.id}
        avatarImage={avatar}
        onClick={onClickAvatar}
      />
    </div>
  );
};

export default ChatAreaHeader;
