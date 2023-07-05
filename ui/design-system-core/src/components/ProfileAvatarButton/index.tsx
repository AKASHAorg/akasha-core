import React from 'react';

import { Profile } from '@akashaorg/typings/ui';

import Avatar, { AvatarSize } from '../Avatar';
import Box from '../Box';
import Button from '../Button';
import Text from '../Text';

export interface ProfileAvatarButtonProps {
  customStyle?: string;
  info?: string | React.ReactElement;
  avatarImage?: Profile['avatar'];
  label?: string;
  size?: AvatarSize;
  profileId: string;
  bold?: boolean;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onClickAvatar?: () => void;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  truncateText?: boolean;
}

const ProfileAvatarButton = React.forwardRef(
  (props: ProfileAvatarButtonProps, ref: React.LegacyRef<HTMLDivElement>) => {
    const {
      customStyle = '',
      size = 'md',
      avatarImage,
      label,
      info,
      profileId,
      truncateText = true,
      onClick,
      onClickAvatar,
      onMouseEnter,
      onMouseLeave,
    } = props;

    const textTruncateStyle = `${truncateText ? 'max-w([7rem] xs:[2rem])' : ''}`;

    return (
      <Box customStyle={`inline-flex items-center space-x-2 ${customStyle}`}>
        <Box title="avatar-box" customStyle="shrink-0">
          <Avatar size={size} avatar={avatarImage} profileId={profileId} onClick={onClickAvatar} />
        </Box>

        <Button
          plain={true}
          title="info-box"
          customStyle="justify-center align-top"
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <Box ref={ref}>
            <Text variant="button-sm" weight="bold" truncate={true} customStyle={textTruncateStyle}>
              {label || profileId}
            </Text>
          </Box>

          <Text variant="footnotes2" color="grey7" truncate={true} customStyle={textTruncateStyle}>
            {info}
          </Text>
        </Button>
      </Box>
    );
  },
);

export default ProfileAvatarButton;
