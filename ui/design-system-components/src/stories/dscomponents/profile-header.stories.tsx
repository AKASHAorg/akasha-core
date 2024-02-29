import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import Header, { HeaderProps } from '../../components/Profile/Header';

const meta: Meta<HeaderProps> = {
  title: 'DSComponents/Profile/ProfileHeader',
  component: Header,
};

export default meta;
type Story = StoryObj<HeaderProps>;

const profileId = 'did:key:003410490050000320006570034567114572000';

const commonProps = {
  id: 'profile-stream-id',
  did: { id: profileId },
  coverImage: null,
  avatar: { default: { src: 'https://placebeard.it/360x360', width: 360, height: 360 } },
  name: 'Coffee Lover',
  flagLabel: 'Flag',
  publicImagePath: '/images',
  transformSource: () => ({
    src: 'https://placebeard.it/360x360',
    width: 360,
    height: 360,
  }),
};

const variants = [
  { ...commonProps },
  { ...commonProps, viewerIsOwner: true },
  {
    ...commonProps,
    ens: null,
  },
];

export const HeaderVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-2" customStyle="w-[50%]">
      {variants.map((variant, idx) => (
        <Header
          key={idx}
          {...variant}
          profileId="profileId"
          onClickCoverImage={() => {
            /** */
          }}
          onClickAvatar={() => {
            /** */
          }}
          onClickProfileName={() => {
            /** */
          }}
          onCloseOverlay={() => {
            /** */
          }}
        />
      ))}
    </Stack>
  ),
};
