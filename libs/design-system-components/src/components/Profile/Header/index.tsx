import React, { ReactElement } from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import ProfileNameField from '@akashaorg/design-system-core/lib/components/ProfileNameField';
import ImageOverlay from '../../ImageOverlay';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import Menu, { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import {
  Cog6ToothIcon,
  EllipsisVerticalIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { getImageFromSeed, getColorClasses } from '@akashaorg/design-system-core/lib/utils';
import type { Image, Profile } from '@akashaorg/typings/lib/ui';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import { cn } from '@akashaorg/ui/lib/library/utils';

type ProfileBadge = {
  toolTipLabel: string;
  label: string;
};

export type HeaderProps = {
  profileId: Profile['did']['id'];
  validAddress?: boolean;
  background?: Profile['background'];
  avatar?: Profile['avatar'];
  profileName: Profile['name'];
  viewerIsOwner?: boolean;
  menuItems?: MenuProps['items'];
  copyLabel?: string;
  copiedLabel?: string;
  followElement?: ReactElement;
  publicImagePath?: string;
  badges?: ProfileBadge[];
  actionElement?: ReactElement;
  activeOverlay?: 'avatar' | 'coverImage' | null;
  plain?: boolean;
  customStyle?: string;
  handleEdit?: () => void;
  transformSource: (src: Image) => Image;
  onClickAvatar: () => void;
  onClickCoverImage: () => void;
  onCloseOverlay: () => void;
  onClickProfileName: () => void;
};

const Header: React.FC<HeaderProps> = ({
  profileId,
  validAddress = true,
  background,
  avatar,
  profileName,
  viewerIsOwner,
  menuItems,
  copyLabel,
  copiedLabel,
  followElement,
  publicImagePath = '/images',
  badges,
  actionElement,
  activeOverlay = null,
  plain = false,
  customStyle = '',
  handleEdit,
  transformSource,
  onClickAvatar,
  onClickCoverImage,
  onCloseOverlay,
  onClickProfileName,
}) => {
  const transformedAvatar = transformSource(avatar?.default);
  const transformedCoverImage = transformSource(background?.default);
  const seed = getImageFromSeed(profileId, 3);
  const coverImageFallback = `${publicImagePath}/profile-cover-${seed}.webp`;
  const backgroundUrl = transformedCoverImage?.src ?? coverImageFallback;
  const avatarContainer = `relative w-20 h-[3.5rem] shrink-0`;

  const profileAvatar = {
    name: 'profile avatar',
    size: { height: transformedAvatar?.height, width: transformedAvatar?.width },
    src: transformedAvatar?.src,
  };
  const profileCoverImage = {
    name: 'profile cover image',
    size: { height: transformedCoverImage?.height, width: transformedCoverImage?.width },
    src: transformedCoverImage?.src,
  };

  return (
    <Stack customStyle={customStyle}>
      <Card
        data-testid="cover-image"
        className="h-32 bg-center bg-no-repeat bg-cover bg-muted rounded-b-none"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
        {...(background && { onClick: onClickCoverImage })}
      />
      <Card
        className={cn(
          'px-[0.5rem] pb-[1rem] pt-0 rounded-t-none overflow-visible border-none',
          plain && 'rounded-none',
        )}
      >
        <Stack direction="column" customStyle="pl-2" fullWidth>
          <Stack direction="row" spacing="gap-x-2" customStyle="-ml-2">
            <Stack customStyle={avatarContainer}>
              <Avatar
                profileId={profileId}
                size="xl"
                avatar={transformedAvatar}
                alternativeAvatars={avatar?.alternatives?.map(alternative =>
                  transformSource(alternative),
                )}
                customStyle={`absolute -top-6 border-2 border-white dark:border-grey2 ${
                  avatar ? 'cursor-pointer' : ''
                } ${getColorClasses(
                  {
                    light: 'grey8',
                    dark: 'grey4',
                  },
                  'bg',
                )}`}
                onClick={onClickAvatar}
              />
            </Stack>
            <Stack direction="column" spacing="gap-y-1">
              <Stack direction="row" align="center" spacing="gap-x-1">
                <button onClick={onClickProfileName}>
                  <ProfileNameField did={profileId} profileName={profileName} size="lg" />
                </button>
              </Stack>
              <DidField
                did={profileId}
                isValid={validAddress}
                copiable={Boolean(copyLabel && copiedLabel)}
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
              />
              <Stack direction="row" spacing="gap-2" customStyle="flex-wrap">
                {badges?.map(badge => (
                  <Tooltip key={badge.label} content={badge.toolTipLabel} placement="bottom">
                    <Pill
                      label={badge.label}
                      color={{ light: 'errorDark2', dark: 'white' }}
                      background={{ light: 'errorFade', dark: 'errorDark2' }}
                      customStyle="px-2"
                      type="info"
                    />
                  </Tooltip>
                ))}
              </Stack>
            </Stack>
            <Stack customStyle="relative ml-auto mt-2">
              <Stack direction="row" align="center" spacing="gap-x-2">
                {viewerIsOwner ? (
                  <Button aria-label="edit" variant="outline" size="icon" onClick={handleEdit}>
                    <Cog6ToothIcon />
                  </Button>
                ) : (
                  <>
                    {actionElement}
                    {followElement}
                  </>
                )}

                {menuItems && (
                  <Stack customStyle="mt-1">
                    <Menu
                      anchor={{
                        icon: <EllipsisVerticalIcon />,
                        variant: 'primary',
                        greyBg: true,
                        iconOnly: true,
                        'aria-label': 'settings',
                      }}
                      items={menuItems}
                      customStyle="w-max z-99"
                    />
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Card>
      {avatar && activeOverlay === 'avatar' && (
        <ImageOverlay
          images={[profileAvatar]}
          clickedImg={profileAvatar}
          closeModal={onCloseOverlay}
        />
      )}

      {background && activeOverlay === 'coverImage' && (
        <ImageOverlay
          images={[profileCoverImage]}
          clickedImg={profileCoverImage}
          closeModal={onCloseOverlay}
        />
      )}
    </Stack>
  );
};
export default Header;
