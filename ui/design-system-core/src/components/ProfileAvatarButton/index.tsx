import React from 'react';

import { Profile } from '@akashaorg/typings/ui';

import Avatar, { AvatarSize } from '../Avatar';
import Box from '../Box';
import Button from '../Button';
import DidField from '../DidField';
import Text from '../Text';

export interface ProfileAvatarButtonProps {
  customStyle?: string;
  avatarImage?: Profile['avatar'];
  label?: string;
  size?: AvatarSize;
  profileId: Profile['did']['id'];
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
      profileId,
      truncateText = true,
      onClick,
      onClickAvatar,
      onMouseEnter,
      onMouseLeave,
    } = props;

    const textTruncateStyle = `${truncateText ? 'max-w([7rem] xs:[2rem])' : ''}`;

    const handleClickAvatar = ev => {
      ev.preventDefault();

      if (onClickAvatar) {
        onClickAvatar();
      }
    };

    return (
      <Button
        plain={true}
        customStyle={`inline-flex items-center space-x-2 ${customStyle}`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Box role="img" aria-label="avatar-box" customStyle="shrink-0">
          <Avatar
            size={size}
            avatar={avatarImage}
            profileId={profileId}
            customStyle="cursor-pointer"
            onClick={handleClickAvatar}
          />
        </Box>

        <Box role="listitem" aria-label="info-box" customStyle="justify-center align-top space-y-1">
          <Box ref={ref}>
            <Text variant="button-sm" weight="bold" truncate={true} customStyle={textTruncateStyle}>
              {label || profileId}
            </Text>
          </Box>
          <DidField did={profileId} isValid={true} copiable={false} />
        </Box>
      </Button>
    );
  },
);

export default ProfileAvatarButton;
