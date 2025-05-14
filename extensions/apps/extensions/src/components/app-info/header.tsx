import React, { MouseEventHandler } from 'react';
import ExtensionIcon from '@akashaorg/design-system-core/lib/components/ExtensionIcon';

import { EllipsisVerticalIcon, TriangleAlertIcon, InfoIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@akashaorg/ui/lib/components/dropdown-menu';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { ListItem } from '@akashaorg/ui/lib/library/list-item';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { AppInfoPill } from './info-pill';
import {
  AkashaAppApplicationType,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import AppAvatar from '@akashaorg/design-system-core/lib/components/AppAvatar';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@akashaorg/ui/lib/akasha-components/tooltip';

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
                <Typography variant="h6" className="font-semibold">
                  {displayName}
                </Typography>
                {isDefaultWorldExtension && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="h-4 w-4" />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {defaultExtensionTooltipContent}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {!isDefaultWorldExtension && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button size="icon" variant="outline">
                        <EllipsisVerticalIcon className="h-4 w-4 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => share?.onClick(share.label)}
                        className={share?.color}
                      >
                        {share?.icon}
                        {share.label}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => report?.onClick(report.label)}
                        className={report?.color}
                      >
                        {report?.icon}
                        {report.label}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </Stack>
              <Stack direction="row" spacing={1} className="flex-wrap">
                {isDefaultWorldExtension && (
                  <AppInfoPill customStyle="bg-gradient-to-r from-primaryStart to-primaryStop">
                    <Typography variant="xs" className="font-medium text-white dark:text-white">
                      {defaultAppPillLabel}
                    </Typography>
                  </AppInfoPill>
                )}
                <AppInfoPill customStyle="bg-tertiaryLight dark:bg-tertiaryDark">
                  <ExtensionIcon type={extensionType} />
                  <Typography
                    variant="xs"
                    className="font-medium text-secondaryLight dark:text-white"
                  >
                    {extensionTypeLabel}
                  </Typography>
                </AppInfoPill>
                {nsfw && (
                  <AppInfoPill customStyle="bg-errorFade dark:bg-errorDark">
                    <Typography variant="xs" className="font-medium text-errorDark dark:text-white">
                      {nsfwLabel}
                    </Typography>
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

                <Typography variant="h6" bold>
                  {isInReviewTitleLabel}
                </Typography>
              </Stack>
              <Typography variant="sm" className="font-light pl-6">
                {isInReviewDescriptionLabel}
              </Typography>
            </Stack>
          </Card>
        )}
      </Stack>
    </Stack>
  );
};
