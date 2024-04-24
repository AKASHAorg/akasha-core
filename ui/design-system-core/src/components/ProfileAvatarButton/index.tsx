import React, { ReactElement } from 'react';
import Avatar from '../Avatar';
import Stack from '../Stack';
import DidField from '../DidField';
import ProfileNameField from '../ProfileNameField';
import Card from '../Card';
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
  onClick?: React.MouseEventHandler<HTMLDivElement>;
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
      <Card onClick={onClick} type="plain" customStyle={customStyle}>
        <Stack direction="row" align="start" spacing="gap-x-2">
          <Avatar
            dataTestId="avatar-box"
            aria-label="avatar-box"
            size="md"
            avatar={avatar}
            profileId={profileId}
            customStyle="shrink-0 cursor-pointer"
            href={href}
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
      </Card>
    );
  },
);

export default ProfileAvatarButton;
