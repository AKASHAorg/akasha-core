import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  FlagIcon,
  ShareIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import AppInfo, { AppInfoProps } from '../../components/AppInfo';

const meta: Meta<AppInfoProps> = {
  title: 'DSComponents/Extensions/AppInfo',
  component: props => (
    <Stack customStyle="w-[50%]">
      <AppInfo {...props} />
    </Stack>
  ),
  tags: ['autodocs'],
};

type Story = StoryObj<AppInfoProps>;

const profileId = 'did:pkh:eip155:5:0x36c703c4d22af437dc883e2e0884e57404e16493';

const avatar = { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } };

export const AppNotInstalled: Story = {
  args: {
    status: 'not-installed',
    integrationName: 'Integration Name',
    integrationType: 'Integration Type',
    nsfw: false,
    nsfwLabel: 'NSFW',
    pluginLabel: 'Plugin',
    share: { label: 'Share', icon: <ShareIcon /> },
    report: {
      label: 'Flag',
      icon: <FlagIcon />,
      color: { light: 'errorLight', dark: 'errorDark' },
    },
    onInstall: () => ({}),
    onUninstall: () => ({}),

    notification: { title: 'notification title', message: 'notification message', action: <></> },
    version: 'Version 2.8.0',
    versionLabel: 'Version',
    updateButtonLabel: 'Update',

    packageName: 'Package name',
    packageNameTitle: 'PackageName title',
    developers: [{ profileId, avatar, name: 'Coffee Lover' }],
    descriptionTitle: 'Description',
    readMore: 'Read More',
    descriptionBody:
      'Some description about the application, around four lines for the mobile version and a few more for the desktop version encourage the author to write more here when maybe just tell them what they need to ... ',
    developersTitle: 'Developers',
    permissionTitle: 'Permission',
    collaboratorsTitle: 'Collaborators',
    galleryTitle: 'Gallery',
    viewAllGalleryCTA: 'View All Gallery',
    generalInfoTitle: 'General Info',
    latestReleaseTitle: 'Latest Release',
    contactSupportTitle: 'Contact Support',
    languageLabel: 'Languages',
    languages: ['en', 'ro', 'es'],
    versionInfo: 'Latest release',
    versionDate: 'December 2022',
    versionDescription:
      "All problems from previous version have been fixed. We cannot guarantee that it'll work 100% well as we are all still working on the fixes. Please feel free to contact us if you are facing any other issue.",
    goToVersionInfoPageLabel: 'Go to version Info',
    documentationTitle: 'Documentation',
    documentationLink: 'https://docs.akasha.world',
    extensionIdTitle: 'Extensions Id',
    extensionId: 'Extensions Id',
    licenseTitle: 'License',
    license: 'AGPL-3.0',
    onAppDescriptionClick: () => ({}),
    onSelectDeveloper: () => ({}),
    onCollaboratorsClick: () => ({}),
    onAppVersionClick: () => ({}),
    onLatestUpdateClick: () => ({}),
    onPermissionInfoClick: () => ({}),
    onLicenseClick: () => ({}),
    onContactSupportClick: () => ({}),
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
  },
};

export const AppInstallLoading: Story = {
  args: {
    status: 'loading',
    integrationName: 'Integration Name',
    integrationType: 'Integration Type',
    nsfw: false,
    nsfwLabel: 'NSFW',
    pluginLabel: 'Plugin',
    share: { label: 'Share', icon: <ShareIcon /> },
    report: {
      label: 'Flag',
      icon: <FlagIcon />,
      color: { light: 'errorLight', dark: 'errorDark' },
    },
    onInstall: () => ({}),
    onUninstall: () => ({}),

    notification: { title: 'notification title', message: 'notification message', action: <></> },
    version: 'Version 2.8.0',
    versionLabel: 'Version',
    updateButtonLabel: 'Update',

    packageName: 'Package name',
    packageNameTitle: 'PackageName title',
    developers: [{ profileId, avatar, name: 'Coffee Lover' }],
    descriptionTitle: 'Description',
    readMore: 'Read More',
    descriptionBody:
      'Some description about the application, around four lines for the mobile version and a few more for the desktop version encourage the author to write more here when maybe just tell them what they need to ... ',
    developersTitle: 'Developers',
    permissionTitle: 'Permission',
    collaboratorsTitle: 'Collaborators',
    galleryTitle: 'Gallery',
    viewAllGalleryCTA: 'View All Gallery',
    generalInfoTitle: 'General Info',
    latestReleaseTitle: 'Latest Release',
    contactSupportTitle: 'Contact Support',
    languageLabel: 'Languages',
    languages: ['en', 'ro', 'es'],
    versionInfo: 'Latest release',
    versionDate: 'December 2022',
    versionDescription:
      "All problems from previous version have been fixed. We cannot guarantee that it'll work 100% well as we are all still working on the fixes. Please feel free to contact us if you are facing any other issue.",
    goToVersionInfoPageLabel: 'Go to version Info',
    documentationTitle: 'Documentation',
    documentationLink: 'https://docs.akasha.world',
    extensionIdTitle: 'Extensions Id',
    extensionId: 'Extensions Id',
    licenseTitle: 'License',
    license: 'AGPL-3.0',
    onAppDescriptionClick: () => ({}),
    onSelectDeveloper: () => ({}),
    onCollaboratorsClick: () => ({}),
    onAppVersionClick: () => ({}),
    onLatestUpdateClick: () => ({}),
    onPermissionInfoClick: () => ({}),
    onLicenseClick: () => ({}),
    onContactSupportClick: () => ({}),
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
  },
};

export const AppInstalled: Story = {
  args: {
    status: 'installed',
    integrationName: 'Integration Name',
    integrationType: 'Integration Type',
    nsfw: false,
    nsfwLabel: 'NSFW',
    pluginLabel: 'Plugin',
    share: { label: 'Share', icon: <ShareIcon /> },
    report: {
      label: 'Flag',
      icon: <FlagIcon />,
      color: { light: 'errorLight', dark: 'errorDark' },
    },
    onInstall: () => ({}),
    onUninstall: () => ({}),

    notification: { title: 'notification title', message: 'notification message', action: <></> },
    version: 'Version 2.8.0',
    versionLabel: 'Version',
    updateButtonLabel: 'Update',

    packageName: 'Package name',
    packageNameTitle: 'PackageName title',
    developers: [{ profileId, avatar, name: 'Coffee Lover' }],
    descriptionTitle: 'Description',
    readMore: 'Read More',
    descriptionBody:
      'Some description about the application, around four lines for the mobile version and a few more for the desktop version encourage the author to write more here when maybe just tell them what they need to ... ',
    developersTitle: 'Developers',
    permissionTitle: 'Permission',
    collaboratorsTitle: 'Collaborators',
    galleryTitle: 'Gallery',
    viewAllGalleryCTA: 'View All Gallery',
    generalInfoTitle: 'General Info',
    latestReleaseTitle: 'Latest Release',
    contactSupportTitle: 'Contact Support',
    languageLabel: 'Languages',
    languages: ['en', 'ro', 'es'],
    versionInfo: 'Latest release',
    versionDate: 'December 2022',
    versionDescription:
      "All problems from previous version have been fixed. We cannot guarantee that it'll work 100% well as we are all still working on the fixes. Please feel free to contact us if you are facing any other issue.",
    goToVersionInfoPageLabel: 'Go to version Info',
    documentationTitle: 'Documentation',
    documentationLink: 'https://docs.akasha.world',
    extensionIdTitle: 'Extensions Id',
    extensionId: 'Extensions Id',
    licenseTitle: 'License',
    license: 'AGPL-3.0',
    onAppDescriptionClick: () => ({}),
    onSelectDeveloper: () => ({}),
    onCollaboratorsClick: () => ({}),
    onAppVersionClick: () => ({}),
    onLatestUpdateClick: () => ({}),
    onPermissionInfoClick: () => ({}),
    onLicenseClick: () => ({}),
    onContactSupportClick: () => ({}),
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
  },
};

export default meta;
