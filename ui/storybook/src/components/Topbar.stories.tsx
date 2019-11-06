/* eslint-disable import/first */
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { notificationsData } from './Popovers.stories';
import { Topbar } from '@akashaproject/design-system';

storiesOf('Topbar', module).add('Topbar', () => (
  <Topbar
    avatarImage="https://placebeard.it/360x360"
    userName="john doe"
    brandLabel="Ethereum.world"
    onNavigation={(path: string) => action('Navigate to')(path)}
    notificationsData={notificationsData}
  />
));
