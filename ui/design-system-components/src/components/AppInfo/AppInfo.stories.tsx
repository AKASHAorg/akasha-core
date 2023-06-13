import React from 'react';
import AppInfo, { AppInfoProps } from '.';

const profileId = '0x003410490050000320006570034567114572000';
const avatar = { default: 'https://placebeard.it/360x360' };

export default {
  title: 'AkashaVerse/AppInfo',
  component: AppInfo,
};

const Template = (args: AppInfoProps) => <AppInfo {...args} />;

export const BaseAppInfo = Template.bind({});

BaseAppInfo.args = {
  integrationName: 'Integration Name',
  packageName: 'Package name',
  developers: [{ profileId, avatar, name: 'Coffee Lover', userName: '@ilovecoffee' }],
  descriptionTitle: 'Description',
  descriptionBody:
    'Some description about the application, around four lines for the mobile version and a few more for the desktop version encourage the author to write more here when maybe just tell them what they need to ... ',
  developersTitle: 'Developers',
  latestReleaseTitle: 'Latest Release',
  version: 'Version 2.8.0',
  versionInfo: 'Latest release',
  versionDate: 'December 2022',
  versionDescription:
    'All problems from previous version have been fixed. We cannot guarantee that it’ll work 100% well as we are all still working on the fixes. Please feel free to contact us if you are facing any other issue.',
  linksAndDocumentationTitle: 'Links & Documentation',
  licenseTitle: 'License',
  license: 'AGPL-3.0',
  share: { label: 'Share', icon: 'ShareIcon' },
  report: { label: 'Report', icon: 'FlagIcon', color: { light: 'errorLight', dark: 'errorDark' } },
};
