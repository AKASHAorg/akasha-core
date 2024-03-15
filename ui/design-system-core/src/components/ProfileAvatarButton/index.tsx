import React, { ReactElement } from 'react';
import Avatar, { AvatarSize } from '../Avatar';
import Stack from '../Stack';
import Button from '../Button';
import DidField from '../DidField';
import ProfileNameField from '../ProfileNameField';
import { type Image } from '@akashaorg/typings/lib/ui';

export type ProfileAvatarButtonProps = {
  customStyle?: string;
  avatar?: Image;
  alternativeAvatars?: Image[];
  label?: string;
  size?: AvatarSize;
  profileId: string;
  bold?: boolean;
  active?: boolean;
  truncateText?: boolean;
  href?: string;
  metadata?: ReactElement;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onClickAvatar?: () => void;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
};

const ProfileAvatarButton = React.forwardRef(
  (props: ProfileAvatarButtonProps, ref: React.LegacyRef<HTMLDivElement>) => {
    const {
      customStyle = '',
      size = 'md',
      avatar,
      label,
      profileId,
      truncateText = true,
      href,
      metadata,
      onClick,
      onClickAvatar,
      onMouseEnter,
      onMouseLeave,
    } = props;

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
        <Stack customStyle="shrink-0" testId="avatar-box" aria-label="avatar-box">
          <Avatar
            size={size}
            avatar={avatar}
            profileId={profileId}
            customStyle="cursor-pointer"
            href={href}
            onClick={handleClickAvatar}
          />
        </Stack>
        <Stack
          justify="center"
          spacing="gap-y-1"
          customStyle="align-top"
          testId="info-box"
          aria-label="info-box"
        >
          <Stack direction="row" align="center" spacing="gap-x-1" ref={ref}>
            <ProfileNameField did={profileId} profileName={label} truncateText={truncateText} />
            {metadata}
          </Stack>
          <DidField did={profileId} isValid={true} copiable={false} />
        </Stack>
      </Button>
    );
  },
);

export default ProfileAvatarButton;
