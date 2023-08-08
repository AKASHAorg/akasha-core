import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Table, { TableProps } from '@akashaorg/design-system-core/lib/components/Table';

export type ActivityTabProps = {
  applicationsTitleLabel: string;
  moderationTitleLabel: string;
  viewAllLabel: string;
  moderationRows: TableProps['rows'];
  applicationsRows: TableProps['rows'];
  onClickViewAll: (activity: 'applications' | 'moderation') => () => void;
  onApplicationsRowClick: (id: string) => void;
  onModerationRowClick: (id: string) => void;
};

export const ActivityTab: React.FC<ActivityTabProps> = props => {
  const {
    applicationsTitleLabel,
    moderationTitleLabel,
    viewAllLabel,
    moderationRows,
    applicationsRows,
    onClickViewAll,
    onApplicationsRowClick,
    onModerationRowClick,
  } = props;

  return (
    <Box customStyle="space-y-4">
      <Box customStyle="px-4">
        <Box customStyle="flex justify-between">
          <Text variant="button-md" weight="bold">
            {applicationsTitleLabel}
          </Text>

          <Button plain={true} onClick={onClickViewAll('applications')}>
            <Text
              variant="button-sm"
              weight="bold"
              color={{ light: 'secondaryDark', dark: 'secondaryDark' }}
            >
              {viewAllLabel}
            </Text>
          </Button>
        </Box>

        <Table
          rows={applicationsRows.slice(0, 4)}
          hasIcons={true}
          clickableRows={true}
          customTdStyle="px-0"
          onRowClick={onApplicationsRowClick}
        />
      </Box>

      <Divider />

      <Box customStyle="px-4">
        <Box customStyle="flex justify-between">
          <Text variant="button-md" weight="bold">
            {moderationTitleLabel}
          </Text>

          <Button plain={true} onClick={onClickViewAll('moderation')}>
            <Text
              variant="button-sm"
              weight="bold"
              color={{ light: 'secondaryDark', dark: 'secondaryDark' }}
            >
              {viewAllLabel}
            </Text>
          </Button>
        </Box>

        <Table
          rows={moderationRows.slice(0, 4)}
          hasIcons={true}
          clickableRows={true}
          customTdStyle="px-0"
          onRowClick={onModerationRowClick}
        />
      </Box>
    </Box>
  );
};
