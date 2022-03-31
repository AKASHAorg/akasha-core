import React from 'react';
import { Grommet } from 'grommet';

import NotificationPill, { INotificationPill } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Notifications/NotificationPill',
  component: NotificationPill,
  argTypes: {
    infoLabel: { control: 'text' },
    handleDismiss: { action: 'pill dismissed' },
  },
};

const Template = (args: INotificationPill) => (
  <Grommet theme={lightTheme}>
    <NotificationPill {...args} />
  </Grommet>
);

export const BaseNotificationPill = Template.bind({});

BaseNotificationPill.args = {
  infoLabel: 'Notification text',
};
