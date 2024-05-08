import React from 'react';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import { tw } from '@twind/core';
import type { Image, Profile } from '@akashaorg/typings/lib/ui';

export type ChatAreaHeaderProps = Pick<Profile, 'name' | 'did'> & {
  avatar?: Image;
  alternativeAvatars?: Image[];
  onClickAvatar?: () => void;
  transformSource: (src: Image) => Image;
};

const ChatAreaHeader: React.FC<ChatAreaHeaderProps> = props => {
  const { name, avatar, alternativeAvatars, did, onClickAvatar, transformSource } = props;

  return (
    <div
      className={tw(
        `flex flex-row w-full items-center p-2 bg(secondaryLight dark:secondaryDark) rounded-t-lg`,
      )}
    >
      <ProfileAvatarButton
        label={name}
        profileId={did.id}
        avatar={transformSource(avatar)}
        alternativeAvatars={alternativeAvatars?.map(alternative => transformSource(alternative))}
        onClick={onClickAvatar}
      />
    </div>
  );
};

export default ChatAreaHeader;
