import React from 'react';
import { apply, tw } from '@twind/core';

import Avatar, { AvatarSize } from '../Avatar';
import type { Image, Profile } from '@akashaorg/typings/lib/ui';

export type StackedAvatarProps = {
  userData: { did: Profile['did']; avatar?: Image; alternativeAvatars?: Image[] }[];
  maxAvatars?: number;
  size?: AvatarSize;
};

const StackedAvatar: React.FC<StackedAvatarProps> = props => {
  const { userData, maxAvatars, size } = props;
  let data = userData;
  if (maxAvatars) {
    data = userData.slice(0, maxAvatars);
  }

  const renderStack = (level: number) => {
    const zIndex = level + 1;

    const className = apply`inline-flex z-[${zIndex}] -ml-${zIndex > 1 ? '3' : '0'}`;

    return (
      <div className={tw(className)}>
        <Avatar
          // clickable avatars
          onClick={() => {
            /** */
          }}
          profileId={data[level].did.id}
          avatar={data[level].avatar}
          alternativeAvatars={data[level].alternativeAvatars}
          size={size}
          border="xs"
        />
        {level + 1 < data.length && renderStack(level + 1)}
      </div>
    );
  };

  return <div className={tw('flex flex-row')}>{renderStack(0)}</div>;
};

export default StackedAvatar;
