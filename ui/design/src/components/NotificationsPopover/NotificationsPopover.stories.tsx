import React from 'react';
import { Box, Grommet } from 'grommet';

import NotificationsPopover, { INotificationsPopover } from '.';

import Icon from '../Icon';

import lightTheme from '../../styles/themes/light/light-theme';
import { notificationsData } from '../../utils/dummy-data';

export default {
  title: 'Popovers/NotificationsPopover',
  component: NotificationsPopover,
  argTypes: {
    onClickNotification: { action: 'clicked notification' },
  },
};

const Template = (args: INotificationsPopover) => {
  const iconRef: React.Ref<any> = React.useRef();
  const [notifcationsOpen, setNotificationsOpen] = React.useState(false);
  return (
    <Grommet theme={lightTheme}>
      <Box fill={true} justify="center" align="center">
        <Box width="medium" pad={{ top: 'large' }}>
          <div ref={iconRef}>
            <Icon type="wallet" onClick={() => setNotificationsOpen(true)} />
          </div>
          {iconRef.current && notifcationsOpen && (
            <NotificationsPopover
              {...args}
              target={iconRef.current}
              closePopover={() => setNotificationsOpen(false)}
            />
          )}
        </Box>
      </Box>
    </Grommet>
  );
};

export const BaseNotificationsPopover = Template.bind({});

BaseNotificationsPopover.args = {
  dataSource: notificationsData,
};
