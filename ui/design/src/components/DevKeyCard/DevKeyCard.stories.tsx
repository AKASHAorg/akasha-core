import React from 'react';
import { Box, Grommet } from 'grommet';

import DevKeyCard, { IDevKeyCardProps } from '.';

import { sampleDevKey } from '../../utils/dummy-data';
import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/DevKeyCard',
  component: DevKeyCard,
  argTypes: {
    onCopyClick: { action: 'key copied!' },
  },
};

const Template = (args: IDevKeyCardProps) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <DevKeyCard {...args} />
    </Box>
  </Grommet>
);

export const BaseDevKeyCard = Template.bind({});

BaseDevKeyCard.args = {
  item: sampleDevKey,
  unusedLabel: 'Unused',
  usedLabel: 'Used',
  devPubKeyLabel: 'Dev Public Key 🔑',
  dateAddedLabel: 'Date added 🗓',
};
