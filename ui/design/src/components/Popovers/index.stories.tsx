/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { Box } from 'grommet';
import * as React from 'react';
import { Icon } from '../Icon/index';
import { NotificationsPopover } from './index';

const notificationsData = [
  {
    user: 'Mariana Gomes',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Comment',
    time: '22 July 2019 | 20h30',
  },
  {
    user: 'Gigi Patratel',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Upvote',
    time: '22 July 2019 | 20h30',
  },
  {
    user: 'Mariana Gomes',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Comment',
    time: '22 July 2019 | 20h30',
  },
  {
    user: 'Gigi Patratel',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Upvote',
    time: '22 July 2019 | 20h30',
  },
  {
    user: 'Mariana Gomes',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Comment',
    time: '22 July 2019 | 20h30',
  },
  {
    user: 'Gigi Patratel',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Upvote',
    time: '22 July 2019 | 20h30',
  },
  {
    user: 'Mariana Gomes',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Comment',
    time: '22 July 2019 | 20h30',
  },
  {
    user: 'Gigi Patratel',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Upvote',
    time: '22 July 2019 | 20h30',
  },
  {
    user: 'Mariana Gomes',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Comment',
    time: '22 July 2019 | 20h30',
  },
  {
    user: 'Gigi Patratel',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Upvote',
    time: '22 July 2019 | 20h30',
  },
];

const NotificationsComponent = () => {
  const iconRef: React.Ref<any> = React.useRef();
  const [notifcationsOpen, setNotificationsOpen] = React.useState(false);
  return (
    <Box fill={true} justify="center" align="center">
      <Box width="medium" pad={{ top: 'large' }}>
        <div ref={iconRef}>
          <Icon type="wallet" onClick={() => setNotificationsOpen(true)} />
        </div>
        {iconRef.current && notifcationsOpen && (
          <NotificationsPopover
            target={iconRef.current}
            dataSource={notificationsData}
            onClickNotification={() => action('Notification Clicked')('Synthetic Event')}
            closePopover={() => setNotificationsOpen(false)}
          />
        )}
      </Box>
    </Box>
  );
};

storiesOf('Popover', module).add('notification', () => <NotificationsComponent />);
