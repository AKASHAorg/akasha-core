import React from 'react';
import { Box, Grommet } from 'grommet';

import AppInfoWidgetCard, { IAppsWidgetCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';
import { appInfo } from '../../utils/dummy-data';

export default {
  title: 'Cards/AppInfoWidgetCard',
  component: AppInfoWidgetCard,
  argTypes: {
    handleSubscribe: { action: 'clicked subscribe' },
    handleReport: { action: 'clicked report' },
  },
};

const Template = (args: IAppsWidgetCardProps) => (
  <Grommet theme={lightTheme}>
    <Box width="30%" pad="none" align="center">
      <AppInfoWidgetCard {...args} />
    </Box>
  </Grommet>
);

export const BaseAppInfoWidgetCard = Template.bind({});

BaseAppInfoWidgetCard.args = {
  appInfo: appInfo,
  versionLabel: 'Version',
  statusLabel: 'Status',
  lastUpdateLabel: 'Last updated',
  submittedLabel: 'Submitted',
  adminLabel: 'Admin',
  categoryLabel: 'Category',
  receiveUpdatesLabel: 'Receive updates from',
  subscribeLabel: 'Subscribe',
  unsubscribeLabel: 'Unsubscribe',
  reportLabel: 'Flag as inappropriate',
};
