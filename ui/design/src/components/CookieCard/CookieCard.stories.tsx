import React from 'react';
import { Box, Grommet } from 'grommet';

import CookieWidgetCard from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/CookieWidgetCard',
  component: CookieWidgetCard,
  argTypes: {
    onClickOnlyEssential: { action: 'clicked subscribe' },
    handleReport: { action: 'clicked report' },
  },
};

const Template = (args: any) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <CookieWidgetCard {...args} />
    </Box>
  </Grommet>
);

export const BaseCookieWidgetCard = Template.bind({});

BaseCookieWidgetCard.args = {
  titleLabel: 'Cookies 🍪',
  contentLabel:
    'To help provide you with the best experience when visiting this Website, we use cookies for security and product improvement purposes in accordance with our',

  privacyUrlLabel: 'Privacy Policy',
  privacyUrl: 'https://ethereum.world/privacy-policy',
  onlyEssentialLabel: 'Only essential',
  acceptAllLabel: 'Accept all',
};
