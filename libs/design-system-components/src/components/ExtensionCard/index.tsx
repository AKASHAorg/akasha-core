import React, { ReactNode } from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import AppCoverImage from '@akashaorg/design-system-core/lib/components/AppCoverImage';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import {
  ProfileAvatarButton,
  ProfileAvatarButtonAvatar,
  ProfileAvatarButtonAvatarFallback,
  ProfileAvatarButtonAvatarImage,
  ProfileDidField,
  ProfileName,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
import ExtensionIcon from '@akashaorg/design-system-core/lib/components/ExtensionIcon';
import { Extension, Image } from '@akashaorg/typings/lib/ui';
import { cn } from '@akashaorg/ui/lib/library/utils';

export type ExtensionCardProps = {
  coverImageSrc: string;
  displayName: string;
  applicationType: Extension['applicationType'];
  extensionTypeLabel: string;
  author?: {
    profileDID: string;
    name: string;
    avatar?: Image;
    alternativeAvatars?: Image[];
    nsfw?: boolean;
  };
  description: string;
  defaultLabel?: string;
  nsfwLabel?: string;
  isDefaultWorldExtension?: boolean;
  nsfw?: boolean;
  featured?: boolean;
  action?: ReactNode;
  customStyle?: string;
};

const ExtensionCard: React.FC<ExtensionCardProps> = props => {
  const {
    coverImageSrc,
    displayName,
    applicationType,
    extensionTypeLabel,
    author,
    description,
    defaultLabel,
    nsfwLabel,
    isDefaultWorldExtension = false,
    nsfw,
    featured,
    action,
    customStyle = '',
  } = props;

  return (
    <Card className={cn('p-4', customStyle)}>
      <Stack spacing={4}>
        <AppCoverImage
          src={coverImageSrc}
          appType={applicationType}
          isNSFW={nsfw}
          customStyle={`${featured ? 'h-[9.625rem]' : 'h-[6.25rem]'} object-cover rounded-[0.625rem]`}
        />
        <Stack spacing={3}>
          <Stack justifyContent="between" alignItems="center" direction="row" spacing={1}>
            <Text variant="h6">{displayName}</Text>
            <>{action}</>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Pill
              color={{ light: 'secondaryLight', dark: 'white' }}
              icon={<ExtensionIcon type={applicationType} size="xs" />}
              weight="normal"
              size="xs"
              label={extensionTypeLabel}
              type="info"
              customStyle="bg-tertiaryLight dark:bg-tertiaryDark"
            />
            {isDefaultWorldExtension && (
              <Pill
                color={{ light: 'white', dark: 'black' }}
                weight="normal"
                size="xs"
                label={defaultLabel}
                type="info"
                customStyle="bg-secondaryLight dark:bg-secondaryDark"
              />
            )}
            {nsfw && (
              <Pill
                color={{ light: 'errorLight', dark: 'white' }}
                weight="normal"
                size="xs"
                label={nsfwLabel}
                type="info"
                customStyle="bg-errorFade dark:bg-errorDark"
              />
            )}
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <ProfileAvatarButton profileDID={author?.profileDID} size="sm">
              <ProfileAvatarButtonAvatar>
                <ProfileAvatarButtonAvatarImage src={author?.avatar?.src} alt="Author Avatar" />
                <ProfileAvatarButtonAvatarFallback />
              </ProfileAvatarButtonAvatar>
              <ProfileName>{author?.name}</ProfileName>
              <ProfileDidField />
            </ProfileAvatarButton>
          </Stack>
          <Text variant="body2" {...(!featured && { lineClamp: 2 })}>
            {description}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
};

export default ExtensionCard;
