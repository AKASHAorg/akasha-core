import * as React from 'react';
import { tw } from '@twind/core';

import { Profile } from '@akashaorg/typings/ui';

import Avatar, { AvatarSize } from '../Avatar';
import Box from '../Box';
import Text from '../Text';

export interface ProfileAvatarButtonProps {
  info?: string | React.ReactElement;
  avatarImage?: Profile['avatar'];
  label?: string;
  size?: AvatarSize;
  customStyle?: string;
  profileId: string;
  bold?: boolean;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onClickAvatar?: () => void;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  truncateText?: boolean;
}

const ProfileAvatarButton = React.forwardRef(
  (props: ProfileAvatarButtonProps, ref: React.LegacyRef<HTMLDivElement>) => {
    const {
      customStyle = '',
      size,
      avatarImage,
      label,
      info,
      onClick,
      onClickAvatar,
      profileId,
      onMouseEnter,
      onMouseLeave,
      truncateText = true,
    } = props;

    const textStyle = `text(lg:base md:xs) ${truncateText ? 'max-w([7rem] xs:[2rem])' : ''}`;

    return (
      <div className={tw(`inline-flex items-center ${customStyle}`)}>
        <div title="avatar-box" className={tw('shrink-0')}>
          <Avatar size={size} avatar={avatarImage} profileId={profileId} onClick={onClickAvatar} />
        </div>
        <div
          title="info-box"
          className={tw('pl(lg:4 md:2 sm:2 xs:1) justify-center align-top')}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <Box ref={ref}>
            <Text variant="button-sm" weight="bold" truncate={true} customStyle={textStyle}>
              {label || profileId}
            </Text>
          </Box>

          <Text variant="footnotes2" color="grey7" truncate={true}>
            {info}
          </Text>
        </div>
      </div>
    );
  },
);

const defaultProps = {
  size: 'md' as AvatarSize,
};

ProfileAvatarButton.defaultProps = defaultProps;

export default ProfileAvatarButton;
