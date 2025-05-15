import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Antenna, Profile } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import MiniProfileCTA, { ItemType, ProfileItemData } from './mini-profile-cta';
import ReportReasonPill from '@akashaorg/design-system-components/lib/components/ReportReasonPill';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
export type ReportEntry = {
  id: string;
  itemData: /* EntryCardProps | */ ProfileItemData;
  appName: string;
  itemType: ItemType;
  primaryReason: string;
  reportCount: number;
  lastReportDate: Date;
};
export type VibesConsoleContentCardProps = {
  entry: ReportEntry;
  caseLabel: string;
  nsfwLabel: string;
  viewProfileLabel: string;
  reportedForLabels: {
    first: string;
    second: string;
  };
  lastReportLabel: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  onReasonClick: (id: string) => void;
  onButtonClick: (action: string, itemType: ItemType, id: string) => () => void;
};
const VibesConsoleContentCard: React.FC<VibesConsoleContentCardProps> = props => {
  const {
    entry,
    caseLabel,
    nsfwLabel,
    viewProfileLabel,
    reportedForLabels,
    lastReportLabel,
    primaryButtonLabel,
    secondaryButtonLabel,
    onReasonClick,
    onButtonClick,
  } = props;
  const buttonStyle = 'w-full md:w-[9.25rem]';
  const secondaryButtonAction = entry.itemType === 'Profile' ? 'Suspend' : 'Delist';
  return (
    <Card className="p-0">
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="between"
        className="p-5 border-b-1 border-solid border-grey8 dark:border-grey5"
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button size="icon" aria-label="itemType">
            {entry.itemType === 'Profile' ? <Profile /> : <Antenna />}
          </Button>
          <Typography variant="h6" bold>
            {entry.appName}{' '}
            {entry.itemType && entry.itemType !== 'Profile' && (
              <Typography variant="xs" className="font-medium">
                - {entry.itemType}
              </Typography>
            )}
          </Typography>
        </Stack>

        <Typography variant="xs" bold>
          {caseLabel}#{' '}
          <Typography variant="xs" className="font-medium">
            {entry.id}
          </Typography>
        </Typography>
      </Stack>

      <Stack spacing={4} className="p-5">
        {/*  {entry.itemType !== 'Profile' && (
          <EntryCard {...(entry.itemData as EntryCardProps)} customStyle={shadowStyle} />
         )} */}

        {entry.itemType === 'Profile' && (
          <Card className="p-4">
            <MiniProfileCTA
              itemData={entry.itemData as ProfileItemData}
              nsfwLabel={nsfwLabel}
              ctaExt={<Button variant="link">{viewProfileLabel}</Button>}
            />
          </Card>
        )}

        <Stack direction="row" spacing={1}>
          <Typography variant="xs" bold className="font-normal">
            {reportedForLabels.first}
          </Typography>
          <Typography variant="xs" bold>
            {entry.itemType ?? entry.appName}
          </Typography>
          <Typography variant="xs" bold className="font-normal">
            {reportedForLabels.second}
          </Typography>
        </Stack>

        <ReportReasonPill
          reason={entry.primaryReason}
          reportCount={entry.reportCount}
          handleClick={() => onReasonClick(entry.id)}
        />

        <Typography variant="xs" className="font-medium">
          {lastReportLabel}:{' '}
          <Typography variant="xs" className="font-medium">
            {formatDate(entry.lastReportDate.toISOString(), 'DD MMM YYYY')}
          </Typography>
        </Typography>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        spacing={4}
        className="p-5 border-t-1 border-solid border-grey8 dark:border-grey5 justify-center md:justify-end"
      >
        <Button
          variant="outline"
          className={buttonStyle}
          onClick={onButtonClick(secondaryButtonAction, entry.itemType, entry.id)}
        >
          {secondaryButtonLabel}
        </Button>
        <Button className={buttonStyle} onClick={onButtonClick('Keep', entry.itemType, entry.id)}>
          {primaryButtonLabel}
        </Button>
      </Stack>
    </Card>
  );
};
export default VibesConsoleContentCard;
