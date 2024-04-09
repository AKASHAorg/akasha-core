import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ReportReasonPill from '@akashaorg/design-system-components/lib/components/ReportReasonPill';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Cog6ToothIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import DashboardItemRenderer from './item-renderer';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';

export type ReportEntry = {
  id: string;
  appName: string;
  itemType: 'Profile' | 'Beam' | 'Reply';
  primaryReason: string;
  reportCount: number;
  lastReportDate: Date;
};

export type DashboardEntryProps = {
  entry: ReportEntry;
  caseLabel: string;
  viewProfileLabel: string;
  reportedForLabels: { first: string; second: string };
  lastReportLabel: string;
  keepButtonLabel: string;
  suspendButtonLabel: string;
};

export const DashboardEntry: React.FC<DashboardEntryProps> = props => {
  const {
    entry,
    caseLabel,
    viewProfileLabel,
    reportedForLabels,
    lastReportLabel,
    keepButtonLabel,
    suspendButtonLabel,
  } = props;

  const textColor = { light: 'grey4', dark: 'grey7' } as const;

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
            aria-label="settings"
            icon={<Cog6ToothIcon />}
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
        <DashboardItemRenderer itemType={entry.itemType} viewProfileLabel={viewProfileLabel} />

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
        justify="end"
        spacing="gap-x-4"
        padding="p-5"
        customStyle="border(t-1 solid grey8 dark:grey5)"
      >
        <Button variant="secondary" label={suspendButtonLabel} customStyle="w-[9.25rem]" />
        <Button variant="primary" label={keepButtonLabel} customStyle="w-[9.25rem]" />
      </Stack>
    </Card>
  );
};
