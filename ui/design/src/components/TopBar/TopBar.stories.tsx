import React from 'react';
import { Grommet } from 'grommet';

import { MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';

import Topbar from '.';
import ViewportSizeProvider from '../Providers/viewport-dimension';

import lightTheme from '../../styles/themes/light/light-theme';
import { installedAppsData, profileData } from '../../utils/dummy-data';

const quickAccessItems = installedAppsData?.filter(
  menuItem => menuItem.area === MenuItemAreaType.QuickAccessArea,
);
const searchAreaItem = installedAppsData?.filter(
  menuItem => menuItem.area === MenuItemAreaType.SearchArea,
)[0];

export default {
  title: 'Bars/Topbar',
  component: Topbar,
  argTypes: {
    brandLabel: { control: 'text' },
    onNavigation: { action: 'navigating...' },
    onSearch: { action: 'searching...' },
    onLoginClick: { action: 'logging in...' },
    onSignUpClick: { action: 'signing up...' },
    onLogout: { action: 'logging out...' },
    onFeedbackClick: { action: 'sending feedback...' },
  },
};

const Template = (args: any) => (
  <Grommet theme={lightTheme}>
    <ViewportSizeProvider>
      <Topbar {...args} />
    </ViewportSizeProvider>
  </Grommet>
);

export const BaseTopbar = Template.bind({});
BaseTopbar.args = {
  loggedProfileData: profileData,
  quickAccessItems: quickAccessItems,
  searchAreaItem: searchAreaItem,
  brandLabel: 'Ethereum World',
};
