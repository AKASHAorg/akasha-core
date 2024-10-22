import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Antenna, Profile } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import MiniProfileCTA, { ItemType, ProfileItemData } from './mini-profile-cta';
import ReportReasonPill from '../ReportReasonPill';
import { formatDate, getElevationClasses } from '@akashaorg/design-system-core/lib/utils';
import EntryCard, { EntryCardProps } from '../Entry/EntryCard';

export type ReportEntry = {
  id: string;
  itemData: EntryCardProps | ProfileItemData;
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
  reportedForLabels: { first: string; second: string };
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

  const textColor = { light: 'grey4', dark: 'grey7' } as const;

  const buttonStyle = 'w-(full md:[9.25rem])';

  const shadowStyle = getElevationClasses('2');

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
            {entry.itemType && entry.itemType !== 'Profile' && (
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
        {entry.itemType !== 'Profile' && (
          <EntryCard {...(entry.itemData as EntryCardProps)} customStyle={shadowStyle} />
        )}

        {entry.itemType === 'Profile' && (
          <Card padding="p-4" customStyle={shadowStyle}>
            <MiniProfileCTA
              itemData={entry.itemData as ProfileItemData}
              nsfwLabel={nsfwLabel}
              ctaExt={<Button variant="text" size="md" label={viewProfileLabel} />}
            />
          </Card>
        )}

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

        <ReportReasonPill
          reason={entry.primaryReason}
          reportCount={entry.reportCount}
          handleClick={() => onReasonClick(entry.id)}
        />

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

export default VibesConsoleContentCard;
