import React, { MouseEventHandler } from 'react';
import ExtensionIcon from '@akashaorg/design-system-core/lib/components/ExtensionIcon';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { EllipsisVerticalIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { ListItem } from '@akashaorg/design-system-core/lib/components/List';
import Menu from '@akashaorg/design-system-core/lib/components/Menu';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { AppInfoPill } from './info-pill';
import {
  AkashaAppApplicationType,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import { InformationCircleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import AppAvatar from '@akashaorg/design-system-core/lib/components/AppAvatar';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';

export type AppInfoHeaderProps = {
  displayName: string;
  extensionType: AkashaAppApplicationType;
  nsfw: boolean;
  nsfwLabel: string;
  extensionTypeLabel: string;
  share: ListItem;
  report: ListItem;
  onInstallClick: MouseEventHandler<HTMLButtonElement>;
  onUninstallClick: MouseEventHandler<HTMLButtonElement>;
  onOpenClick: MouseEventHandler<HTMLButtonElement>;
  extensionAvatar: AppImageSource;
  isInstalled?: boolean;
  isDefaultWorldExtension?: boolean;
  defaultAppPillLabel?: string;
  installExtensionLabel?: string;
  uninstallExtensionLabel?: string;
  openExtensionLabel?: string;
  defaultExtensionTooltipContent?: string;
  isInstallable?: boolean;
  isInReview?: boolean;
  isInReviewTitleLabel: string;
  isInReviewDescriptionLabel: string;
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
    isInReview,
    isInReviewTitleLabel,
    isInReviewDescriptionLabel,
    onInstallClick,
    onUninstallClick,
    onOpenClick,
    extensionAvatar,
    isInstalled = false,
    isInstallable = true,
    isDefaultWorldExtension = false,
    defaultAppPillLabel = 'Default',
    installExtensionLabel = 'Install',
    uninstallExtensionLabel = 'Uninstall',
    openExtensionLabel = 'Open',
    defaultExtensionTooltipContent = `This extension is preinstalled in this world and cannot be uninstalled`,
  } = props;

  return (
    <Stack direction="row" align="start" justify="between" padding="pb-3">
      <Stack direction="column" spacing="gap-6">
        <Stack direction="row" align="stretch" spacing="gap-x-2" customStyle={'flex-grow'}>
          <AppAvatar appType={extensionType} avatar={extensionAvatar} width={7} height={7} />
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
                    <Text variant="footnotes2" color={{ light: 'white', dark: 'white' }}>
                      {defaultAppPillLabel}
                    </Text>
                  </AppInfoPill>
                )}
                <AppInfoPill background={{ light: 'tertiaryLight', dark: 'tertiaryDark' }}>
                  <ExtensionIcon type={extensionType} />
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
              <Stack direction="row" spacing="gap-x-1">
                {!isDefaultWorldExtension && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onUninstallClick}
                    className="w-1/2 md:w-min"
                  >
                    {uninstallExtensionLabel}
                  </Button>
                )}
                {(extensionType === AkashaAppApplicationType.App ||
                  extensionType === AkashaAppApplicationType.Other) && (
                  <Button size="sm" onClick={onOpenClick} className="w-1/2 md:w-min">
                    {openExtensionLabel}
                  </Button>
                )}
              </Stack>
            )}
            {!isInstalled && !isDefaultWorldExtension && isInstallable && (
              <Stack direction="row" spacing="gap-x-1" customStyle="flex-wrap w-full md:w-min">
                <Button size="sm" onClick={onInstallClick} className="w-full md:w-min">
                  {installExtensionLabel}
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>
        {isInReview && (
          <Card className="p-4 bg-nested-card">
            <Stack direction="column" spacing="gap-2">
              <Stack direction="row" align="center" spacing="gap-2">
                <Icon
                  icon={<ExclamationTriangleIcon />}
                  size="md"
                  color={{ light: 'warningLight', dark: 'warningDark' }}
                />
                <Text variant="h6" weight="bold">
                  {isInReviewTitleLabel}
                </Text>
              </Stack>
              <Text variant="body2" weight="light" customStyle="pl-6">
                {isInReviewDescriptionLabel}
              </Text>
            </Stack>
          </Card>
        )}
      </Stack>
    </Stack>
  );
};
