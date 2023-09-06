import React from 'react';

import { Profile } from '@akashaorg/typings/ui';

import Avatar, { AvatarSize } from '../Avatar';
import Stack from '../Stack';
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
        <Stack customStyle="shrink-0" data-testid="avatar-box" aria-label="avatar-box">
          <Avatar
            size={size}
            avatar={avatarImage}
            profileId={profileId}
            customStyle="cursor-pointer"
            onClick={handleClickAvatar}
          />
        </Stack>
        <Stack
          justify="center"
          spacing="gap-y-1"
          customStyle="align-top"
          data-testid="info-box"
          aria-label="info-box"
        >
          <Stack ref={ref}>
            <Text variant="button-sm" weight="bold" truncate={true} customStyle={textTruncateStyle}>
              {label || profileId}
            </Text>
          </Stack>
          <DidField did={profileId} isValid={true} copiable={false} />
        </Stack>
      </Button>
    );
  },
);

export default ProfileAvatarButton;
