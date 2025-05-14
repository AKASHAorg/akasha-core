import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import ReportReasonPill from '@akashaorg/design-system-components/lib/components/ReportReasonPill';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
export type TransparencyLogItemType = 'Beam' | 'Reflection' | 'Profile';
export type TransparencyLogItem = {
  id: string;
  type: TransparencyLogItemType;
  contentId: string;
  reportedDate: Date;
  moderatedDate: Date;
  status: 'Kept' | 'Delisted' | 'Suspended';
  reports: number;
  reason: string;
};
export type TransparencyLogItemCardProps = {
  item: TransparencyLogItem;
  caseLabel: string;
  reportedLabel: string;
  resolvedLabel: string;
};
const TransparencyLogItemCard: React.FC<TransparencyLogItemCardProps> = props => {
  const { item, caseLabel, reportedLabel, resolvedLabel } = props;
  const textColor = {
    light: 'grey5',
    dark: 'grey7',
  } as const;
  return (
    <Card className="p-0">
      <Stack
        spacing="gap-y-1"
        padding="p-4"
        customStyle={`rounded-t-2xl ${item.status === 'Kept' ? 'bg-success/10 dark:bg-success/30' : 'bg-errorLight/10 dark:bg-errorDark/40'}`}
      >
        <Stack direction="row" align="center" justify="between">
          <Typography variant="h5">{item.type}</Typography>
          <Stack direction="row" spacing="gap-x-1">
            <Typography variant="xs" className="font-medium font-normal">
              {`${caseLabel} # `}
            </Typography>
            <Typography variant="xs" className="font-medium font-normal">
              {`${item.type.substring(0, 1).toLocaleUpperCase()}-${item.contentId}`}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" align="center" spacing="gap-x-1.5">
          <Stack
            customStyle={`w-2 h-2 rounded-full ${item.status === 'Kept' ? 'bg-success' : 'bg-errorLight dark:bg-errorDark'}`}
          />
          <Typography variant="xs" className="font-medium font-normal">
            {item.status}
          </Typography>
        </Stack>

        <Stack direction="row" align="center" justify="between">
          <Stack direction="row" spacing="gap-x-1">
            <Typography variant="xs" className="font-medium font-normal">
              {`${reportedLabel} `}
            </Typography>
            <Typography variant="xs" className="font-medium font-normal">
              {formatDate(item.reportedDate.toISOString(), 'DD-MM-YYYY')}
            </Typography>
          </Stack>

          <Stack direction="row" spacing="gap-x-1">
            <Typography variant="xs" className="font-medium font-normal">
              {`${resolvedLabel} `}
            </Typography>
            <Typography variant="xs" className="font-medium font-normal">
              {formatDate(item.moderatedDate.toISOString(), 'DD-MM-YYYY')}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {item.status === 'Kept' && (
        <Stack customStyle="mt-4 mx-4">
          {/* pass the correct data, when enabled */}
          {/* <EntryCard /> */}
        </Stack>
      )}

      <Stack padding="p-4" spacing="gap-y-2">
        <Typography>
          {`This ${item.type} has been ${item.status === 'Delisted' ? 'delisted' : 'reported'} for`}
        </Typography>
        <ReportReasonPill
          reason={item.reason}
          reportCount={item.reports}
          handleClick={() => {
            /** */
          }}
        />
      </Stack>
    </Card>
  );
};
export default TransparencyLogItemCard;
