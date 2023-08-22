import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Box from '@akashaorg/design-system-core/lib/components/Box';

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
    <Box customStyle="w-[40%] p-0 items-center">
      <DevKeyCard
        item={sampleDevKey}
        unusedLabel="Unused"
        usedLabel="Used"
        nonameLabel="Unnamed key"
        devPubKeyLabel="Dev Public Key 🔑"
        dateAddedLabel="Date added 🗓"
      />
    </Box>
  ),
};
