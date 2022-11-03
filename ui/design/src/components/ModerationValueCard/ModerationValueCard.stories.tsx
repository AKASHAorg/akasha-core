import React from 'react';
import { Box, Grommet } from 'grommet';

import ModerationValueCard, { IModerationValueCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/ModerationValueCard',
  component: ModerationValueCard,
  argTypes: {
    label: { control: 'text' },
    assetName: { control: 'text' },
    description: { control: 'text' },
    ctaLabel: { control: 'text' },
    ctaUrl: { control: 'text' },
  },
};

const Template = (args: IModerationValueCardProps) => {
  return (
    <Grommet theme={lightTheme}>
      <Box width={args.isMini ? '162px' : '50%'}>
        <ModerationValueCard {...args} />
      </Box>
    </Grommet>
  );
};

export const BaseModerationValueCard = Template.bind({});

export const BaseModerationValueMiniCard = Template.bind({});

BaseModerationValueMiniCard.args = {
  label: 'Human-Centric Products',
  assetName: 'humancentricproducts',
  isMini: true,
};

BaseModerationValueCard.args = {
  label: 'Transparency',
  assetName: 'transparency',
  description:
    'We act with transparency as individuals and live by our values as a community. We will never compromise our values, even if this impacts our revenues.',
  ctaLabel: 'Discuss this value',
  ctaUrl: 'Discuss this value',
};
