import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ReportReasonPill from '@akashaorg/design-system-components/lib/components/ReportReasonPill';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Antenna, Profile } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { DashboardItemRenderer, ItemType } from './item-renderer';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';

export type ReportEntry = {
  id: string;
  appName: string;
  nsfw: boolean;
  itemType: ItemType;
  primaryReason: string;
  reportCount: number;
  lastReportDate: Date;
};

export type DashboardEntryProps = {
  entry: ReportEntry;
  caseLabel: string;
  nsfwLabel: string;
  viewProfileLabel: string;
  reportedForLabels: { first: string; second: string };
  lastReportLabel: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  onButtonClick: (action: string, itemType: ItemType, id: string) => () => void;
};

export const DashboardEntry: React.FC<DashboardEntryProps> = props => {
  const {
    entry,
    caseLabel,
    nsfwLabel,
    viewProfileLabel,
    reportedForLabels,
    lastReportLabel,
    primaryButtonLabel,
    secondaryButtonLabel,
    onButtonClick,
  } = props;

  const textColor = { light: 'grey4', dark: 'grey7' } as const;

  const buttonStyle = 'w-(full md:[9.25rem])';

  const secondaryButtonAction = entry.itemType === 'Profile' ? 'Suspend' : 'Delist';

  return (
    <Card padding={0}>
      <Stack
        direction="row"
        align="center"
        justify="between"
        padding="p-5"
        customStyle="border(b-1 solid grey8 dark:grey5)"
      >
        <Stack direction="row" align="center" spacing="gap-x-2">
          <Button
            aria-label="itemType"
            icon={entry.itemType === 'Profile' ? <Profile /> : <Antenna />}
            variant="primary"
            onClick={() => {
              /** */
            }}
            greyBg
            iconOnly
          />
          <Text variant="h6" weight="bold">
            {entry.appName}{' '}
            {entry.itemType && (
              <Text as="span" variant="footnotes2">
                - {entry.itemType}
              </Text>
            )}
          </Text>
        </Stack>

        <Text variant="button-sm">
          {caseLabel}#{' '}
          <Text as="span" variant="footnotes2" color={textColor}>
            {entry.id}
          </Text>
        </Text>
      </Stack>

      <Stack padding="p-5" spacing="gap-y-4">
        <DashboardItemRenderer
          itemType={entry.itemType}
          viewProfileLabel={viewProfileLabel}
          nsfw={entry.nsfw}
          nsfwLabel={nsfwLabel}
        />

        <Stack direction="row" spacing="gap-x-1">
          <Text variant="button-sm" weight="normal" color={textColor}>
            {reportedForLabels.first}
          </Text>
          <Text as="span" variant="button-sm" color={textColor}>
            {entry.itemType ?? entry.appName}
          </Text>
          <Text variant="button-sm" weight="normal" color={textColor}>
            {reportedForLabels.second}
          </Text>
        </Stack>

        <ReportReasonPill reason={entry.primaryReason} reportCount={entry.reportCount} />

        <Text variant="footnotes2">
          {lastReportLabel}:{' '}
          <Text as="span" variant="footnotes2" color={textColor}>
            {formatDate(entry.lastReportDate.toISOString(), 'DD MMM YYYY')}
          </Text>
        </Text>
      </Stack>

      <Stack
        direction="row"
        align="center"
        spacing="gap-x-4"
        padding="p-5"
        customStyle="border(t-1 solid grey8 dark:grey5) justify(center md:end)"
      >
        <Button
          variant="secondary"
          label={secondaryButtonLabel}
          customStyle={buttonStyle}
          onClick={onButtonClick(secondaryButtonAction, entry.itemType, entry.id)}
        />
        <Button
          variant="primary"
          label={primaryButtonLabel}
          customStyle={buttonStyle}
          onClick={onButtonClick('Keep', entry.itemType, entry.id)}
        />
      </Stack>
    </Card>
  );
};
