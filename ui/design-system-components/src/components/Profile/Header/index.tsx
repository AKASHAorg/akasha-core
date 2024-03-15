import React, { ReactElement } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import ProfileNameField from '@akashaorg/design-system-core/lib/components/ProfileNameField';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import CopyToClipboard from '@akashaorg/design-system-core/lib/components/CopyToClipboard';
import ImageOverlay from '../../ImageOverlay';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
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
  ensName?: 'loading' | string;
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
  ensName,
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
        elevation={plain ? 'none' : '1'}
        radius={{ top: 20 }}
        background={{ light: 'grey7', dark: 'grey5' }}
        customStyle={`h-32 bg(center no-repeat cover [url(${backgroundUrl})])`}
        {...(background && { onClick: onClickCoverImage })}
      />
      <Card
        elevation={plain ? 'none' : '1'}
        radius={plain ? '' : { bottom: 20 }}
        padding="px-[0.5rem] pb-[1rem] pt-0"
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
                <Button plain={true} onClick={onClickProfileName}>
                  <ProfileNameField did={profileId} profileName={profileName} size="lg" />
                </Button>
              </Stack>
              <DidField
                did={profileId}
                isValid={validAddress}
                copiable={Boolean(copyLabel && copiedLabel)}
                copyLabel={copyLabel}
                copiedLabel={copiedLabel}
              />
              <Stack direction="row" spacing="gap-2" customStyle="flex-wrap">
                {badges.map(badge => (
                  <Tooltip
                    key={badge.label}
                    content={badge.toolTipLabel}
                    placement="bottom"
                    backgroundColor={{ light: 'grey6', dark: 'grey4' }}
                  >
                    <Pill
                      label={badge.label}
                      background="errorDark"
                      borderColor="errorLight"
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
                  <Button
                    aria-label="edit"
                    icon={<Cog6ToothIcon />}
                    variant="primary"
                    onClick={handleEdit}
                    greyBg
                    iconOnly
                  />
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
          <Stack direction="column" spacing="gap-y-4">
            {ensName === 'loading' ? (
              <>
                <TextLine width="w-24" animated />
                <TextLine width="w-72" animated />
              </>
            ) : (
              ensName && (
                <>
                  <Divider />
                  <Stack direction="column" spacing="gap-y-1.5">
                    <Text variant="label">ENS Name</Text>
                    <CopyToClipboard value={ensName}>
                      <Text
                        variant="body2"
                        color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                      >
                        {ensName}
                      </Text>
                    </CopyToClipboard>
                  </Stack>
                </>
              )
            )}
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
