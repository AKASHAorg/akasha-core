import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import DevKeyCard, { DevKeyCardProps } from '../../components/DevKeyCard';

import { sampleDevKey } from '../../utils/dummy-data';

const meta: Meta<DevKeyCardProps> = {
  title: 'DSComponents/Cards/DevKeyCard',
  component: DevKeyCard,
};

export default meta;
type Story = StoryObj<DevKeyCardProps>;

export const BaseDevKeyCard: Story = {
  render: () => (
    <Stack direction="row" align="center" justify="center" fullWidth padding="p-0">
      <DevKeyCard
        item={sampleDevKey}
        unusedLabel="Unused"
        usedLabel="Used"
        nonameLabel="Unnamed key"
        devPublicKeyLabel="Dev Public Key 🔑"
        dateAddedLabel="Date added 🗓"
      />
    </Stack>
  ),
};
