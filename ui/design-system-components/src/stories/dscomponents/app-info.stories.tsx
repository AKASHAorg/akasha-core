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
  component: AppInfo,
};

export default meta;
type Story = StoryObj<AppInfoProps>;

const profileId = '0x003410490050000320006570034567114572000';

const avatar = { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } };

const variants: AppInfoProps['status'][] = ['not-installed', 'loading', 'installed'];

export const AppInfoVariants: Story = {
  render: () => (
    <Stack direction="column" spacing="gap-y-4" customStyle="w-[50%]">
      {variants.map((variant, idx) => (
        <Stack key={idx}>
          <AppInfo
            status={variant}
            integrationName="Integration Name"
            packageName="Package name"
            developers={[{ profileId, avatar, name: 'Coffee Lover' }]}
            descriptionTitle="Description"
            descriptionBody="Some description about the application, around four lines for the mobile version and a few more for the desktop version encourage the author to write more here when maybe just tell them what they need to ... "
            developersTitle="Developers"
            latestReleaseTitle="Latest Release"
            version="Version 2.8.0"
            versionInfo="Latest release"
            versionDate="December 2022"
            versionDescription="All problems from previous version have been fixed. We cannot guarantee that it'll work 100% well as we are all still working on the fixes. Please feel free to contact us if you are facing any other issue."
            linksAndDocumentationTitle="Links & Documentation"
            licenseTitle="License"
            license="AGPL-3.0"
            share={{ label: 'Share', icon: <ShareIcon /> }}
            report={{
              label: 'Flag',
              icon: <FlagIcon />,
              color: { light: 'errorLight', dark: 'errorDark' },
            }}
            onInstall={() => ({})}
            onUninstall={() => ({})}
            onSelectDeveloper={() => ({})}
            transformSource={() => ({
              src: 'https://placebeard.it/360x360',
              width: 360,
              height: 360,
            })}
          />
        </Stack>
      ))}
    </Stack>
  ),
};
