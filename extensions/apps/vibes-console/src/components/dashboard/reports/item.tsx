import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { FlagIcon } from 'lucide-react';
import MiniProfileCTA from '../../vibes-console-content-card/mini-profile-cta';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
export type TReport = {
  name: string;
  did: {
    id: string;
  };
  flags: {
    explanation: string;
  }[];
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
  return (
    <Card className="shadow-none p-0">
      <Stack className="p-4 border-b-1 border-b-solid border-b-grey8 dark:border-b-grey5">
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
            <Stack direction="row" alignItems="center" spacing={1} className="py-2 px-3 w-fit rounded-full bg-secondaryLight/30 dark:bg-secondaryDark">
              <FlagIcon className="h-4 w-4 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-grey2" />
              <Typography variant="xs" className="font-medium text-secondaryLight dark:text-grey2">
                {report.flags.length}
              </Typography>
            </Stack>
          }
        />
      </Stack>
      <Stack spacing={2} className="p-4">
        {report.flags.slice(0, sliceIndex).map((r, id, ar) => (
          <Stack key={id} spacing={3}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" justifyContent="between">
                <Typography variant="xs" bold>
                  Flag #{id + 1}
                </Typography>
                <Typography variant="xs" className="font-medium">
                  {formatDate(report.date.toISOString(), 'DD MMM YYYY')}
                </Typography>
              </Stack>
              <Typography
                variant="xs"
                {...(!r.explanation && {
                  color: 'grey7',
                })}
                className="font-medium"
              >
                {r.explanation.length ? r.explanation : noExplanationLabel}
              </Typography>
            </Stack>
            {id < ar.length - 1 && <Separator />}
          </Stack>
        ))}
        {/* show view more button only if there are more than 2 flags */}
        {report.flags.length > 2 && viewMoreLabel && (
          <Button
            variant="link"
            onClick={() => onClickViewMore(report.did.id)}
            className="self-end"
          >
            {viewMoreLabel}
          </Button>
        )}
      </Stack>
    </Card>
  );
};
