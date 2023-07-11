import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';

import { DevKeyCard, DevKeyCardProps } from '.';

import { sampleDevKey } from '../../utils/dummy-data';

export default {
  title: 'Cards/DevKeyCard',
  component: DevKeyCard,
  argTypes: {
    onCopyClick: { action: 'key copied!' },
  },
};

const Template = (args: DevKeyCardProps) => (
  <Box customStyle="w-[30%] p-0 items-center">
    <DevKeyCard {...args} />
  </Box>
);

export const BaseDevKeyCard = Template.bind({});

BaseDevKeyCard.args = {
  item: sampleDevKey,
  unusedLabel: 'Unused',
  usedLabel: 'Used',
  devPubKeyLabel: 'Dev Public Key 🔑',
  dateAddedLabel: 'Date added 🗓',
};
