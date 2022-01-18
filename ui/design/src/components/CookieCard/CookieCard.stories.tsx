import React from 'react';
import { Box, Grommet } from 'grommet';

import CookieWidgetCard, { ICookieWidgetCard } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/CookieWidgetCard',
  component: CookieWidgetCard,
  argTypes: {
    onClickAcceptAll: { action: 'clicked accept all' },
    onClickOnlyEssential: { action: 'clicked accept only essential' },
  },
};

const Template = (args: ICookieWidgetCard) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <CookieWidgetCard {...args} />
    </Box>
  </Grommet>
);

export const BaseCookieWidgetCard = Template.bind({});

BaseCookieWidgetCard.args = {
  titleLabel: 'Cookies 🍪',
  paragraphOneLabel:
    'To help provide you with the best experience when visiting this Website, we use cookies for security and product improvement purposes in accordance with our',
  privacyCTALabel: 'For more info, see our ',
  privacyUrlLabel: 'Privacy Policy',
  privacyUrl: 'https://ethereum.world/privacy-policy',
  onlyEssentialLabel: 'Only essential',
  acceptAllLabel: 'Accept all',
};
