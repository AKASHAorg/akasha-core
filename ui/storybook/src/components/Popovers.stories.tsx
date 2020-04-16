/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';

const { Box, Icon, NotificationsPopover, SelectPopover } = DS;
export const notificationsData = [
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    user: 'Mariana Gomes',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Comment',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003420490050000320006570034567114572000',
    user: 'Gigi Patratel',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Upvote',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    user: 'Mariana Gomes',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Comment',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003420490050000320006570034567114572000',
    user: 'Gigi Patratel',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Upvote',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    user: 'Mariana Gomes',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Comment',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003420490050000320006570034567114572000',
    user: 'Gigi Patratel',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Upvote',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    user: 'Mariana Gomes',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Comment',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003420490050000320006570034567114572000',
    user: 'Gigi Patratel',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Upvote',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003410490050000320006570034567114572000',
    user: 'Mariana Gomes',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Comment',
    time: '22 July 2019 | 20h30',
  },
  {
    ethAddress: '0x003420490050000320006570034567114572000',
    user: 'Gigi Patratel',
    userAvatar: 'http://placebeard.it/640/480',
    action: 'Upvote',
    time: '22 July 2019 | 20h30',
  },
];

export const providerData = [
  { providerName: '3box', value: 'Some short text' },
  {
    providerName: 'ENS',
    value:
      'A very long and uninspiring text, duplicated.A very long and uninspiring text, duplicated.A very long and uninspiring text, duplicated.',
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

const SelectComponent = () => {
  const iconRef: React.Ref<any> = React.useRef();
  const [selectOpen, setSelectOpen] = React.useState(false);
  return (
    <Box fill={true} justify="center" align="center">
      <Box width="medium" pad={{ top: 'large' }}>
        <div ref={iconRef}>
          <Icon type="eye" onClick={() => setSelectOpen(true)} />
        </div>
        {iconRef.current && selectOpen && (
          <SelectPopover
            target={iconRef.current}
            dataSource={providerData}
            onClickElem={() => action('Elem Clicked')('Synthetic Event')}
            closePopover={() => setSelectOpen(false)}
          />
        )}
      </Box>
    </Box>
  );
};

storiesOf('Popover/Notifications Popover', module).add('notification', () => (
  <NotificationsComponent />
));
storiesOf('Popover/Select Popover', module).add('select', () => <SelectComponent />);
