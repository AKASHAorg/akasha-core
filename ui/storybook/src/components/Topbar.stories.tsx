/* eslint-disable import/first */
import DS from '@akashaproject/design-system';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { notificationsData } from './Popovers.stories';

const { TextIcon, Topbar } = DS;
storiesOf('Topbar', module).add('Topbar', () => (
  <Topbar
    avatarImage="https://placebeard.it/360x360"
    userName="john doe"
    brandLabel={<TextIcon iconType="ethereumWorldLogo" label="Ethereum.world" bold={true} />}
    onNavigation={(path: string) => action('Navigate to')(path)}
    notificationsData={notificationsData}
  />
));
