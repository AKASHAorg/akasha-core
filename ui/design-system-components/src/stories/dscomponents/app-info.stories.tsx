import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  FlagIcon,
  ShareIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import AppInfo, { AppInfoProps } from '../../components/AppInfo';

const Wrapped: React.FC<AppInfoProps> = props => (
  <Stack customStyle="w-[50%]">
    <AppInfo {...props} />
  </Stack>
);

const meta: Meta<AppInfoProps> = {
  title: 'DSComponents/Extensions/AppInfo',
  component: Wrapped,
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ['not-installed', 'loading', 'installed'] },
    integrationName: { control: 'text' },
    packageName: { control: 'text' },
    developers: { control: 'object' },
    descriptionTitle: { control: 'text' },
    descriptionBody: { control: 'text' },
    developersTitle: { control: 'text' },
    latestReleaseTitle: { control: 'text' },
    version: { control: 'text' },
    versionInfo: { control: 'text' },
    versionDate: { control: 'text' },
    versionDescription: { control: 'text' },
    linksAndDocumentationTitle: { control: 'text' },
    licenseTitle: { control: 'text' },
    license: { control: 'text' },
    share: { control: 'object' },
    report: { control: 'object' },
    onInstall: { action: 'app installed' },
    onUninstall: { action: 'app uninstalled' },
    onSelectDeveloper: { action: 'app developer selected' },
    transformSource: { action: 'source transformed' },
  },
};

type Story = StoryObj<AppInfoProps>;

const profileId = 'did:pkh:eip155:5:0x36c703c4d22af437dc883e2e0884e57404e16493';

const avatar = { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } };

const baseArgs: Story = {
  args: {
    integrationName: 'Integration Name',
    packageName: 'Package name',
    developers: [{ profileId, avatar, name: 'Coffee Lover' }],
    descriptionTitle: 'Description',
    descriptionBody:
      'Some description about the application, around four lines for the mobile version and a few more for the desktop version encourage the author to write more here when maybe just tell them what they need to ... ',
    developersTitle: 'Developers',
    latestReleaseTitle: 'Latest Release',
    version: 'Version 2.8.0',
    versionInfo: 'Latest release',
    versionDate: 'December 2022',
    versionDescription:
      "All problems from previous version have been fixed. We cannot guarantee that it'll work 100% well as we are all still working on the fixes. Please feel free to contact us if you are facing any other issue.",
    linksAndDocumentationTitle: 'Links & Documentation',
    licenseTitle: 'License',
    license: 'AGPL-3.0',
    share: { label: 'Share', icon: <ShareIcon /> },
    report: {
      label: 'Flag',
      icon: <FlagIcon />,
      color: { light: 'errorLight', dark: 'errorDark' },
    },
    onInstall: () => ({}),
    onUninstall: () => ({}),
    onSelectDeveloper: () => ({}),
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
  },
};

export const AppNotInstalled: Story = {
  args: { ...baseArgs.args, status: 'not-installed' },
};

export const AppInstallLoading: Story = {
  args: { ...baseArgs.args, status: 'loading' },
};

export const AppInstalled: Story = {
  args: { ...baseArgs.args, status: 'installed' },
};

export default meta;
