import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { FlagIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
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
  const textColor = { light: 'grey5', dark: 'grey7' } as const;

  return (
    <Card padding={0}>
      <Stack
        spacing="gap-y-1"
        padding="p-4"
        customStyle={`rounded-t-2xl bg-(${
          item.status === 'Kept' ? 'success/10 dark:success/30' : 'errorLight/10 dark:errorDark/40'
        })`}
      >
        <Stack direction="row" align="center" justify="between">
          <Text variant="h5">{item.type}</Text>
          <Stack direction="row" spacing="gap-x-1">
            <Text variant="footnotes2" weight="normal" color={textColor}>
              {`${caseLabel} # `}
            </Text>
            <Text variant="footnotes2" weight="normal">
              {`${item.type.substring(0, 1).toLocaleUpperCase()}-${item.contentId}`}
            </Text>
          </Stack>
        </Stack>

        <Stack direction="row" align="center" spacing="gap-x-1.5">
          <Stack
            customStyle={`w-2 h-2 rounded-full ${
              item.status === 'Kept' ? 'bg-success' : 'bg-(errorLight dark:errorDark)'
            }`}
          />
          <Text variant="footnotes2" weight="normal">
            {item.status}
          </Text>
        </Stack>

        <Stack direction="row" align="center" justify="between">
          <Stack direction="row" spacing="gap-x-1">
            <Text variant="footnotes2" weight="normal" color={textColor}>
              {`${reportedLabel} `}
            </Text>
            <Text variant="footnotes2" weight="normal">
              {formatDate(item.reportedDate.toISOString(), 'DD-MM-YYYY')}
            </Text>
          </Stack>

          <Stack direction="row" spacing="gap-x-1">
            <Text variant="footnotes2" weight="normal" color={textColor}>
              {`${resolvedLabel} `}
            </Text>
            <Text variant="footnotes2" weight="normal">
              {formatDate(item.moderatedDate.toISOString(), 'DD-MM-YYYY')}
            </Text>
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
        <Text variant="body1" color={textColor}>
          {`This ${item.type} has been ${item.status === 'Delisted' ? 'delisted' : 'reported'} for`}
        </Text>
        <Stack
          direction="row"
          customStyle="w-fit rounded-full bg-(secondaryLight/30 dark:secondaryDark/30)"
        >
          <Stack direction="row" align="center" spacing="gap-x-1" padding="p-2">
            <Icon
              icon={<FlagIcon />}
              size="sm"
              color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
            />
            <Text variant="footnotes2" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
              {item.reports}
            </Text>
          </Stack>

          <Stack padding="p-2" customStyle="border(l-1 solid white dark:grey2)">
            <Text variant="footnotes2" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
              {item.reason}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default TransparencyLogItemCard;
