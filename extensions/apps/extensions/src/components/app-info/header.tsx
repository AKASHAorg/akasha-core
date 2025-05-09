import React, { MouseEventHandler } from 'react';
import ExtensionIcon from '@akashaorg/design-system-core/lib/components/ExtensionIcon';

import { EllipsisVerticalIcon, TriangleAlertIcon, InfoIcon } from 'lucide-react';
import { ListItem } from '@akashaorg/design-system-core/lib/components/List';
import Menu from '@akashaorg/design-system-core/lib/components/Menu';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { AppInfoPill } from './info-pill';
import {
  AkashaAppApplicationType,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
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
    <Stack direction="row" alignItems="start" justifyContent="between" className="pb-3">
      <Stack direction="column" spacing={6}>
        <Stack direction="row" alignItems="stretch" spacing={2} className="flex-grow">
          <AppAvatar appType={extensionType} avatar={extensionAvatar} width={7} height={7} />
          <Stack justifyContent="between" className="flex-grow">
            <Stack>
              <Stack direction="row" alignItems="start" spacing={2} justifyContent="between">
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
                    <InfoIcon className="h-4 w-4" />
                  </Tooltip>
                )}
                {!isDefaultWorldExtension && (
                  <Menu
                    anchor={{
                      icon: <EllipsisVerticalIcon className='h-4 w-4 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark' />,
                      variant: 'primary',
                      size: 'xs',
                      greyBg: true,
                      iconOnly: true,
                    }}
                    items={[share, report]}
                  />
                )}
              </Stack>
              <Stack direction="row" spacing={1} className="flex-wrap">
                {isDefaultWorldExtension && (
                  <AppInfoPill customStyle="bg-gradient-to-r from-primaryStart to-primaryStop">
                    <Text variant="footnotes2" color={{ light: 'white', dark: 'white' }}>
                      {defaultAppPillLabel}
                    </Text>
                  </AppInfoPill>
                )}
                <AppInfoPill customStyle="bg-tertiaryLight dark:bg-tertiaryDark">
                  <ExtensionIcon type={extensionType} />
                  <Text variant="footnotes2" color={{ light: 'secondaryLight', dark: 'white' }}>
                    {extensionTypeLabel}
                  </Text>
                </AppInfoPill>
                {nsfw && (
                  <AppInfoPill customStyle="bg-errorFade dark:bg-errorDark">
                    <Text variant="footnotes2" color={{ light: 'errorDark', dark: 'white' }}>
                      {nsfwLabel}
                    </Text>
                  </AppInfoPill>
                )}
              </Stack>
            </Stack>
            {(isInstalled || isDefaultWorldExtension) && (
              <Stack direction="row" spacing={1}>
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
              <Stack direction="row" spacing={1} className="flex-wrap w-full md:w-min">
                <Button size="sm" onClick={onInstallClick} className="w-full md:w-min">
                  {installExtensionLabel}
                </Button>
              </Stack>
            )}
          </Stack>
        </Stack>
        {isInReview && (
          <Card className="p-4 bg-nested-card">
            <Stack direction="column" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <TriangleAlertIcon className="h-4 w-4 [&>*]:stroke-warningLight dark:[&>*]:stroke-warningDark" />

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
