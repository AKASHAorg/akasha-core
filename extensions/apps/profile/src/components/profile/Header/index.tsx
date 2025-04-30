import React, { ReactElement } from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import ProfileNameField from '@akashaorg/design-system-core/lib/components/ProfileNameField';
import ImageOverlay from '@akashaorg/design-system-components/lib/components/ImageOverlay';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import Menu, { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@akashaorg/ui/lib/akasha-components/tooltip';
import {
  Cog6ToothIcon,
  EllipsisVerticalIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { getImageFromSeed } from '@akashaorg/design-system-core/lib/utils';
import type { Image, Profile } from '@akashaorg/typings/lib/ui';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import { cn } from '@akashaorg/ui/lib/library/utils';
import { cssVars } from '@akashaorg/ui/lib/library/to-css-var';
import {
  ProfileAvatar,
  ProfileAvatarFallback,
  ProfileAvatarImage,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar';

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
    <Stack className={customStyle}>
      <Card
        data-testid="cover-image"
        className="h-32 bg-center bg-no-repeat bg-cover bg-muted rounded-b-none border-none bg-(image:--background-url)"
        style={cssVars({ '--background-url': `url('${backgroundUrl}')` })}
        {...(background && { onClick: onClickCoverImage })}
      />
      <Card
        className={cn(
          'px-[0.5rem] pb-[1rem] pt-0 rounded-t-none overflow-visible',
          plain && 'rounded-none border-b-0 border-x-0',
        )}
      >
        <Stack direction="column" className="pl-2 w-full">
          <Stack direction="row" spacing={2} className="-ml-2">
            <Stack className={avatarContainer}>
              <button onClick={onClickAvatar}>
                <ProfileAvatar
                  profileDID={profileId}
                  size="xl"
                  className="absolute -top-6 border-2 border-border"
                >
                  <ProfileAvatarImage src={transformedAvatar?.src} />
                  <ProfileAvatarFallback />
                </ProfileAvatar>
              </button>
            </Stack>
            <Stack direction="column" spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
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
              <Stack direction="row" spacing={2} className="flex-wrap">
                {badges?.map(badge => (
                  <TooltipProvider delayDuration={0} key={badge.label}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Pill
                          label={badge.label}
                          color={{ light: 'errorDark2', dark: 'white' }}
                          customStyle="px-2 bg-errorFade dark:bg-errorDark2"
                          type="info"
                        />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">{badge.toolTipLabel}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </Stack>
            </Stack>
            <Stack className="relative ml-auto mt-2">
              <Stack direction="row" alignItems="center" spacing={2}>
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
                  <Stack className="mt-1">
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
