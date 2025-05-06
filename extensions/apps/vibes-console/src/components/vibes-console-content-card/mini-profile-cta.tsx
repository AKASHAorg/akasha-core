import React from 'react';
import { Image } from '@akashaorg/typings/lib/ui';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ExclamationTriangleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import {
  ProfileAvatarButton,
  ProfileDidField,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
export type ItemType = 'Profile' | 'Beam' | 'Reflection';
export type ProfileItemData = {
  avatar: Image;
  alternativeAvatars: Image[];
  name: string;
  did: {
    id: string;
  };
  nsfw: boolean;
};
export type MiniProfileCTAProps = {
  itemData: ProfileItemData;
  nsfwLabel?: string;
  ctaExt: React.ReactNode;
};
const MiniProfileCTA: React.FC<MiniProfileCTAProps> = props => {
  const { itemData, nsfwLabel, ctaExt } = props;
  return (
    <Stack direction="row" alignItems="center" justifyContent="between">
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            size="md"
            avatar={itemData.avatar}
            alternativeAvatars={itemData.alternativeAvatars}
          />
          <Stack>
            <Tooltip content="Golden Showers" placement="right">
              <Typography
                variant="sm"
                bold
                className="max-w([12.5rem] md:[7.5rem]) w-fit cursor-default"
              >
                {itemData.name}
              </Typography>
            </Tooltip>

            <ProfileAvatarButton profileDID={itemData.did.id}>
              <ProfileDidField />
            </ProfileAvatarButton>
          </Stack>
        </Stack>

        {itemData.nsfw && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            className="py-1 px-2 bg-warningLight/30 dark:bg-warningDark/30 rounded-[0.25rem]"
          >
            <Icon
              icon={<ExclamationTriangleIcon />}
              size="xs"
              customStyle="[&>*]:stroke-warningLight dark:[&>*]:stroke-warningDark"
            />
            <Typography variant="xs" className="font-medium font-normal">
              {nsfwLabel}
            </Typography>
          </Stack>
        )}
      </Stack>

      {ctaExt}
    </Stack>
  );
};
export default MiniProfileCTA;
