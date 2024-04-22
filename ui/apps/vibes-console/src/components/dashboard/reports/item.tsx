import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { FlagIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import MiniProfileCTA from '@akashaorg/design-system-components/lib/components/VibesConsoleContentCard/mini-profile-cta';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Button from '@akashaorg/design-system-core/lib/components/Button';

export type TReport = {
  name: string;
  did: { id: string };
  flags: { explanation: string }[];
  date: Date;
};

export type ReportItemProps = {
  report: TReport;
  sliceIndex?: number;
  noExplanationLabel: string;
  viewMoreLabel?: string;
  onClickViewMore?: (reportId: string) => void;
};

export const ReportItem: React.FC<ReportItemProps> = props => {
  const { report, sliceIndex, noExplanationLabel, viewMoreLabel, onClickViewMore } = props;

  const textColor = { light: 'grey5', dark: 'grey6' } as const;

  return (
    <Card padding={0}>
      <Stack padding="p-4" customStyle="border-b(1 solid grey8 dark:grey5)">
        <MiniProfileCTA
          itemData={{
            avatar: {
              height: 320,
              src: 'https://placebeard.it/360x360',
              width: 320,
            },
            alternativeAvatars: [],
            name: report.name,
            did: report.did,
            nsfw: false,
          }}
          ctaExt={
            <Stack
              direction="row"
              align="center"
              spacing="gap-x-1"
              padding="py-2 px-3"
              customStyle="w-fit rounded-full bg-(secondaryLight/30 dark:secondaryDark)"
            >
              <Icon
                icon={<FlagIcon />}
                size="sm"
                color={{ light: 'secondaryLight', dark: 'grey2' }}
              />
              <Text variant="footnotes2" color={{ light: 'secondaryLight', dark: 'grey2' }}>
                {report.flags.length}
              </Text>
            </Stack>
          }
        />
      </Stack>
      <Stack padding="p-4" spacing="gap-y-2">
        {report.flags.slice(0, sliceIndex).map((r, id, ar) => (
          <Stack key={id} spacing="gap-y-3">
            <Stack spacing="gap-y-3">
              <Stack direction="row" align="center" justify="between">
                <Text variant="button-sm" color={textColor}>
                  Flag #{id + 1}
                </Text>
                <Text variant="footnotes2" color={textColor}>
                  {formatDate(report.date.toISOString(), 'DD MMM YYYY')}
                </Text>
              </Stack>
              <Text variant="footnotes2" {...(!r.explanation && { color: 'grey7' })}>
                {r.explanation.length ? r.explanation : noExplanationLabel}
              </Text>
            </Stack>
            {id < ar.length - 1 && <Divider />}
          </Stack>
        ))}
        {/* show view more button only if there are more than 2 flags */}
        {report.flags.length > 2 && viewMoreLabel && (
          <Button
            variant="text"
            label={viewMoreLabel}
            onClick={() => onClickViewMore(report.did.id)}
            customStyle="self-end"
          />
        )}
      </Stack>
    </Card>
  );
};
