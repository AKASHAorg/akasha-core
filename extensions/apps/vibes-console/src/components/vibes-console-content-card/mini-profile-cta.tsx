import React from 'react';
import { Image } from '@akashaorg/typings/lib/ui';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { TriangleAlertIcon } from 'lucide-react';
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
  did: { id: string };
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
              <Text
                variant="body2"
                weight="bold"
                customStyle="max-w([12.5rem] md:[7.5rem]) w-fit cursor-default"
              >
                {itemData.name}
              </Text>
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
            <TriangleAlertIcon className="h-3 w-3 [&>*]:stroke-warningLight dark:[&>*]:stroke-warningDark" />
            <Text variant="footnotes2" weight="normal">
              {nsfwLabel}
            </Text>
          </Stack>
        )}
      </Stack>

      {ctaExt}
    </Stack>
  );
};

export default MiniProfileCTA;
