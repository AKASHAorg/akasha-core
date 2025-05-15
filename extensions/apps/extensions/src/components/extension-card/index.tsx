import React, { ReactNode } from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import AppCoverImage from '@akashaorg/design-system-core/lib/components/AppCoverImage';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import {
  ProfileAvatarButton,
  ProfileAvatarButtonAvatar,
  ProfileAvatarButtonAvatarFallback,
  ProfileAvatarButtonAvatarImage,
  ProfileDidField,
  ProfileName,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
import { ExtensionTypeIcon } from '@akashaorg/ui/lib/akasha-components/extension-type-icon';

import { Extension, Image } from '@akashaorg/typings/lib/ui';
import { cn } from '@akashaorg/ui/lib/library/utils';
import { CopyToClipboard } from '@akashaorg/ui/lib/akasha-components/copy-to-clipboard';
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
            <Typography variant="h6">{displayName}</Typography>
            <>{action}</>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Pill
              color={{
                light: 'secondaryLight',
                dark: 'white',
              }}
              icon={<ExtensionTypeIcon extensionType={applicationType} className="h-3 w-3" />}
              weight="normal"
              size="xs"
              label={extensionTypeLabel}
              type="info"
              customStyle="bg-tertiaryLight dark:bg-tertiaryDark"
            />
            {isDefaultWorldExtension && (
              <Pill
                color={{
                  light: 'white',
                  dark: 'black',
                }}
                weight="normal"
                size="xs"
                label={defaultLabel}
                type="info"
                customStyle="bg-secondaryLight dark:bg-secondaryDark"
              />
            )}
            {nsfw && (
              <Pill
                color={{
                  light: 'errorLight',
                  dark: 'white',
                }}
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
              <CopyToClipboard
                textToCopy={author?.profileDID}
                ctaText="Copy to clipboard"
                successText="Copied"
              >
                <ProfileDidField />
              </CopyToClipboard>
            </ProfileAvatarButton>
          </Stack>
          <Typography
            variant="sm"
            {...(!featured && {
              className: 'line-clamp-2',
            })}
          >
            {description}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};
export default ExtensionCard;
