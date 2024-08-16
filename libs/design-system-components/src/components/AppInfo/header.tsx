import React from 'react';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Plugin } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { ArrowDownIcon, ArrowPathIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { ListItem } from '@akashaorg/design-system-core/lib/components/List';
import Menu from '@akashaorg/design-system-core/lib/components/Menu';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { DuplexAppButton } from './duplex-app-button';
import { AppInfoPill } from './info-pill';

export type AppInfoHeaderProps = {
  integrationName: string;
  integrationType: string;
  nsfw: boolean;
  nsfwLabel: string;
  pluginLabel: string;
  share: ListItem;
  report: ListItem;
  status: 'installed' | 'not-installed' | 'loading';
  onInstall: () => void;
  onUninstall: () => void;
};

export const AppInfoHeader: React.FC<AppInfoHeaderProps> = props => {
  const {
    integrationName,
    integrationType,
    nsfw,
    nsfwLabel,
    pluginLabel,
    share,
    report,
    status,
    onInstall,
    onUninstall,
  } = props;

  return (
    <Stack direction="row" align="center" justify="between" customStyle="-mt-3">
      <Stack direction="row" align="start" spacing="gap-x-2">
        <Stack
          background={{
            light: 'grey8',
            dark: 'grey5',
          }}
          customStyle="-mt-4 rounded-lg w-[4.375rem] h-[4.375rem]"
        />
        <Stack>
          <Text variant="h6" weight="semibold">
            {integrationName}
          </Text>
          <Stack direction="row" spacing="gap-x-1" customStyle="flex-wrap">
            {integrationType === 'plugin' && (
              <AppInfoPill background={{ light: 'tertiaryLight', dark: 'tertiaryDark' }}>
                <Icon
                  size="sm"
                  icon={<Plugin />}
                  color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                  solid={true}
                />
                <Text variant="footnotes2" color={{ light: 'secondaryLight', dark: 'white' }}>
                  {pluginLabel}
                </Text>
              </AppInfoPill>
            )}
            {nsfw && (
              <AppInfoPill background={{ light: 'errorFade', dark: 'errorDark' }}>
                <Text variant="footnotes2" color={{ light: 'errorDark', dark: 'white' }}>
                  {nsfwLabel}
                </Text>
              </AppInfoPill>
            )}
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row" align="start" spacing="gap-x-2">
        {/* using align 'start' here, because Menu component has a gap between its anchor and popover */}
        {status === 'installed' && <DuplexAppButton onUninstall={onUninstall} />}
        {status === 'not-installed' && (
          <Button
            icon={<ArrowDownIcon />}
            variant="primary"
            size="xs"
            iconOnly
            onClick={onInstall}
          />
        )}
        {status === 'loading' && (
          <AppIcon
            placeholderIcon={<ArrowPathIcon />}
            iconColor="white"
            background="secondaryDark"
            size="xs"
          />
        )}
        <Menu
          anchor={{
            icon: <EllipsisVerticalIcon />,
            variant: 'primary',
            size: 'xs',
            greyBg: true,
            iconOnly: true,
          }}
          items={[share, report]}
        />
      </Stack>
    </Stack>
  );
};
