import React from 'react';
import { Image } from '@akashaorg/typings/lib/ui';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ExclamationTriangleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';

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
    <Stack direction="row" align="center" justify="between">
      <Stack spacing="gap-y-3">
        <Stack direction="row" spacing="gap-x-2" align="center">
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

            <DidField did={itemData.did.id} />
          </Stack>
        </Stack>

        {itemData.nsfw && (
          <Stack
            direction="row"
            align="center"
            padding="py-1 px-2"
            spacing="gap-x-1"
            background={{ light: 'warningLight/30', dark: 'warningDark/30' }}
            customStyle="rounded-[0.25rem]"
          >
            <Icon
              icon={<ExclamationTriangleIcon />}
              size="xs"
              color={{ light: 'warningLight', dark: 'warningDark' }}
            />
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
