import React from 'react';
import { EntityTypes } from '@akashaorg/typings/lib/ui';
import { transformSource } from '@akashaorg/ui-awf-hooks';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import EntryCard, {
  EntryCardProps,
} from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ExclamationTriangleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';

export type DashboardItemRendererProps = {
  itemType: 'Profile' | 'Beam' | 'Reply';
  viewProfileLabel: string;
  nsfw: boolean;
  nsfwLabel: string;
};

export const sampleEntryData: EntryCardProps = {
  isLoggedIn: true,
  entryData: {
    active: true,
    authorId: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8',
    createdAt: '12/12/2023',
    id: 'kshggg55555',
  },
  authorProfile: {
    data: {
      did: { id: 'did:pkh:eip155:5:0xa2aabe32856a8d50c748d50a5111312d986208a8' },
      name: 'Coffee Lover',
    },
    loading: false,
    error: new Error('an error occured'),
  },
  itemType: EntityTypes?.REFLECT,
  flagAsLabel: 'Flag',
  slateContent: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'This content will be reported, for test purposes',
        },
      ],
    },
  ],
  onContentClick: () => ({}),
  onMentionClick: () => ({}),
  onTagClick: () => ({}),
  transformSource: () => ({
    src: 'https://placebeard.it/360x360',
    width: 360,
    height: 360,
  }),
};

const DashboardItemRenderer: React.FC<DashboardItemRendererProps> = props => {
  const { itemType, viewProfileLabel, nsfw, nsfwLabel } = props;

  const avatar = {
    default: {
      height: 320,
      src: '',
      width: 320,
    },
    alternatives: [],
  };

  const textStyle = 'max-w([12.5rem] md:[7.5rem]) w-fit cursor-default';

  if (itemType !== 'Profile') {
    return <EntryCard {...sampleEntryData} />;
  }

  return (
    <Card>
      <Stack direction="row" align="center" justify="between">
        <Stack spacing="gap-y-3">
          <Stack direction="row" spacing="gap-x-2" align="center">
            <Avatar
              size="md"
              avatar={transformSource(avatar?.default)}
              alternativeAvatars={avatar?.alternatives?.map(alternative =>
                transformSource(alternative),
              )}
            />
            <Stack>
              <Tooltip content="Golden Showers" placement="right">
                <Text variant="body2" weight="bold" customStyle={textStyle}>
                  Golden Showers
                </Text>
              </Tooltip>

              <DidField did="somerandomdid" />
            </Stack>
          </Stack>

          {nsfw && (
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

        <Button plain={true}>
          <Text variant="button-md" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
            {viewProfileLabel}
          </Text>
        </Button>
      </Stack>
    </Card>
  );
};

export default DashboardItemRenderer;
