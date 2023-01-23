import React from 'react';
import { tw } from '@twind/core';

import Avatar from '../Avatar';

import { IStackedAvatarProps } from '../../interfaces/stackedAvatar.interface';

const StackedAvatar: React.FC<IStackedAvatarProps> = props => {
  const { userData, maxAvatars, size } = props;
  let data = userData;
  if (maxAvatars) {
    data = userData.slice(0, maxAvatars);
  }

  const renderStack = (level: number) => {
    const zIndex = level + 1;

    const className = `inline-flex z-${zIndex} -ml-${zIndex > 1 ? '3' : '0'}`;

    return (
      <div className={tw(className)}>
        <Avatar
          // clickable avatars
          onClick={() => {
            /** */
          }}
          ethAddress={data[level].ethAddress}
          src={data[level].avatar}
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
