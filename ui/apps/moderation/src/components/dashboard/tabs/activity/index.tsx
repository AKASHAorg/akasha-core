import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Table, { ITableProps } from '@akashaorg/design-system-core/lib/components/Table';

export type IActivityTabProps = {
  applicationsTitleLabel: string;
  moderationTitleLabel: string;
  viewAllLabel: string;
  moderationRows: ITableProps['rows'];
  onClickViewAll: (activity: 'applications' | 'moderation') => () => void;
};

export const ActivityTab: React.FC<IActivityTabProps> = props => {
  const {
    applicationsTitleLabel,
    moderationTitleLabel,
    viewAllLabel,
    moderationRows,
    onClickViewAll,
  } = props;

  return (
    <Box customStyle="space-y-4">
      <Box customStyle="flex justify-between p-4">
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

      <Divider />

      <Box customStyle="p-4">
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

        <Table rows={moderationRows.slice(0, 4)} hasIcons={true} />
      </Box>
    </Box>
  );
};
