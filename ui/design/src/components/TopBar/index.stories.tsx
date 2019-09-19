/* eslint-disable import/first */
// import { action } from '@storybook/addon-actions'
import { boolean, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import TopBar from './index';

storiesOf('TopBar', module).add('TopBar', () => (
  <TopBar
    balance={boolean('Balance', true)}
    cyclingStates={{}}
    showNotificationsPanel={boolean('showNotificationsPanel', false)}
    showTransactionsLog={boolean('showTransactionsLog', false)}
    showSecondarySidebar={boolean('showSecondarySidebar', false)}
    toggleAethWallet={() => ({})}
    toggleEthWallet={() => ({})}
    toggleGuestModal={() => ({})}
    unreadNotifications={number('unreadNotifications', 3)}
  />
));
