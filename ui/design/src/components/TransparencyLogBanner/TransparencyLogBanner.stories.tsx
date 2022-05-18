import React from 'react';
import { Box, Grommet } from 'grommet';

import TransparencyLogBanner, { ITransparencyLogBannerProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/TransparencyLogBanner',
  component: TransparencyLogBanner,
  argType: {
    size: { control: 'text' },
    assetName: { control: 'text' },
    title: { control: 'text' },
    content: { control: 'text' },
    keptCount: { control: 'number' },
    delistedCount: { control: 'number' },
    keptCountLabel: { control: 'text' },
    totalCountLabel: { control: 'text' },
    delistedCountLabel: { control: 'text' },
    footerLabel1: { control: 'text' },
    footerLabel2: { control: 'text' },
    footerLinkLabel: { control: 'text' },
    footerLink: { control: 'text' },
  },
};

const Template = (args: ITransparencyLogBannerProps) => (
  <Grommet theme={lightTheme}>
    <Box width="57.5%" pad="none" align="center">
      <TransparencyLogBanner {...args} />
    </Box>
  </Grommet>
);

const keptCount = 1634;
const delistedCount = 102;

export const BaseTransparencyLogBanner = Template.bind({});

BaseTransparencyLogBanner.args = {
  size: '18.75rem',
  assetName: 'moderation-history-illustration',
  title: 'Moderation history',
  content:
    'Here you will find the moderated posts, replies, and accounts of Ethereum World. We do not reveal any personal information of the author or submitter(s) to protect their privacy.',
  keptCount: keptCount,
  keptCountLabel: 'kept',
  totalCountLabel: 'total',
  delistedCount: delistedCount,
  delistedCountLabel: 'delisted',
  footerLabel1: 'Check out the Ethereum World ',
  footerLabel2: ' here.',
  footerLinkLabel: 'Code of Conduct',
  footerLink: 'https://akasha.ethereum.world/legal/code-of-conduct',
};
