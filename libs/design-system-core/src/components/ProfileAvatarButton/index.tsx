import React, { ReactElement } from 'react';
import Avatar from '../Avatar';
import DidField from '../DidField';
import Link from '../Link';
import ProfileNameField from '../ProfileNameField';
import Stack from '../Stack';
import { type Image } from '@akashaorg/typings/lib/ui';

export type ProfileAvatarButtonProps = {
  avatar?: Image;
  alternativeAvatars?: Image[];
  label?: string;
  profileId: string;
  truncateText?: boolean;
  href?: string;
  metadata?: ReactElement;
  customStyle?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const ProfileAvatarButton = React.forwardRef(
  (props: ProfileAvatarButtonProps, ref: React.LegacyRef<HTMLDivElement>) => {
    const {
      customStyle = '',
      avatar,
      label,
      profileId,
      truncateText = true,
      href,
      metadata,
      onClick,
    } = props;

    return (
      <Link to={href} onClick={onClick}>
        <Stack direction="row" align="start" spacing="gap-x-2" customStyle={customStyle}>
          <Avatar
            dataTestId="avatar-box"
            aria-label="avatar-box"
            size="md"
            avatar={avatar}
            profileId={profileId}
            customStyle="shrink-0 cursor-pointer"
          />
          <Stack
            justify="center"
            spacing="gap-y-1"
            customStyle="align-top"
            dataTestId="info-box"
            aria-label="info-box"
          >
            <Stack direction="row" align="center" spacing="gap-x-1" ref={ref}>
              <ProfileNameField did={profileId} profileName={label} truncateText={truncateText} />
              {metadata}
            </Stack>
            <DidField did={profileId} isValid={true} copiable={false} />
          </Stack>
        </Stack>
      </Link>
    );
  },
);

export default ProfileAvatarButton;
