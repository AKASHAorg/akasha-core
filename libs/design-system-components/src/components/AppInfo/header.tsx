import React, { MouseEventHandler, useMemo } from 'react';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  Plugin,
  App,
  Widget,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { ListItem } from '@akashaorg/design-system-core/lib/components/List';
import Menu from '@akashaorg/design-system-core/lib/components/Menu';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { AppInfoPill } from './info-pill';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import { InformationCircleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Button from '@akashaorg/design-system-core/lib/components/Button';

export type AppInfoHeaderProps = {
  displayName: string;
  extensionType: string;
  nsfw: boolean;
  nsfwLabel: string;
  extensionTypeLabel: string;
  share: ListItem;
  report: ListItem;
  onInstallClick: MouseEventHandler<HTMLButtonElement>;
  onUninstallClick: MouseEventHandler<HTMLButtonElement>;
  onOpenClick: MouseEventHandler<HTMLButtonElement>;
  extensionIconSrc: string;
  isInstalled?: boolean;
  isDefaultWorldExtension?: boolean;
  defaultAppPillLabel?: string;
  installExtensionLabel?: string;
  uninstallExtensionLabel?: string;
  openExtensionLabel?: string;
  defaultExtensionTooltipContent?: string;
};

export const AppInfoHeader: React.FC<AppInfoHeaderProps> = props => {
  const {
    displayName,
    extensionType,
    nsfw,
    nsfwLabel,
    extensionTypeLabel,
    share,
    report,
    onInstallClick,
    onUninstallClick,
    onOpenClick,
    extensionIconSrc,
    isInstalled = false,
    isDefaultWorldExtension = false,
    defaultAppPillLabel = 'Default',
    installExtensionLabel = 'Install',
    uninstallExtensionLabel = 'Uninstall',
    openExtensionLabel = 'Open',
    defaultExtensionTooltipContent = `This extension is preinstalled in this world and cannot be uninstalled`,
  } = props;

  const pillIconByAppType = useMemo(() => {
    switch (extensionType) {
      case AkashaAppApplicationType.App:
        return <App />;
      case AkashaAppApplicationType.Widget:
        return <Widget />;
      default:
        return <Plugin />;
    }
  }, [extensionType]);

  return (
    <Stack direction="row" align="start" justify="between" padding="pb-3">
      <Stack direction="row" align="stretch" spacing="gap-x-2" customStyle={'flex-grow'}>
        <Stack
          background={{
            light: 'grey8',
            dark: 'grey5',
          }}
          customStyle={`rounded-lg w-28 h-28 bg(center no-repeat cover [url(${extensionIconSrc})])`}
        />
        <Stack justify="between" customStyle={'flex-grow'}>
          <Stack>
            <Stack direction="row" align="start" spacing="gap-x-2" justify="between">
              <Text variant="h6" weight="semibold">
                {displayName}
              </Text>
              {isDefaultWorldExtension && (
                <Tooltip
                  placement={'bottom'}
                  content={defaultExtensionTooltipContent}
                  customStyle="self-center"
                  contentCustomStyle="max-w-sm"
                >
                  <Icon size="md" icon={<InformationCircleIcon />} />
                </Tooltip>
              )}
              {!isDefaultWorldExtension && (
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
              )}
            </Stack>
            <Stack direction="row" spacing="gap-x-1" customStyle="flex-wrap">
              {isDefaultWorldExtension && (
                <AppInfoPill
                  background={{
                    gradient: 'gradient-to-r',
                    from: 'primaryStart',
                    to: 'primaryStop',
                  }}
                >
                  <Text variant="footnotes2">{defaultAppPillLabel}</Text>
                </AppInfoPill>
              )}
              <AppInfoPill background={{ light: 'tertiaryLight', dark: 'tertiaryDark' }}>
                <Icon
                  size="sm"
                  icon={pillIconByAppType}
                  color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                  solid={true}
                />
                <Text variant="footnotes2" color={{ light: 'secondaryLight', dark: 'white' }}>
                  {extensionTypeLabel}
                </Text>
              </AppInfoPill>
              {nsfw && (
                <AppInfoPill background={{ light: 'errorFade', dark: 'errorDark' }}>
                  <Text variant="footnotes2" color={{ light: 'errorDark', dark: 'white' }}>
                    {nsfwLabel}
                  </Text>
                </AppInfoPill>
              )}
            </Stack>
          </Stack>
          {(isInstalled || isDefaultWorldExtension) && (
            <Stack direction="row" spacing="gap-x-1" customStyle="flex-wrap">
              {!isDefaultWorldExtension && (
                <Button
                  variant="secondary"
                  label={uninstallExtensionLabel}
                  onClick={onUninstallClick}
                />
              )}
              {(extensionType === AkashaAppApplicationType.App ||
                extensionType === AkashaAppApplicationType.Other) && (
                <Button variant="primary" label={openExtensionLabel} onClick={onOpenClick} />
              )}
            </Stack>
          )}
          {!isInstalled && !isDefaultWorldExtension && (
            <Stack direction="row" spacing="gap-x-1" customStyle="flex-wrap">
              <Button variant="primary" label={installExtensionLabel} onClick={onInstallClick} />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
