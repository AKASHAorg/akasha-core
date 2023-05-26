import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { IPageHeaderProps, PageHeader } from '../../../common';

export type IApplicationDetailProps = IPageHeaderProps & {
  categoryLabel: string;
  categories: string[];
  reasonLabel: string;
  reason: string;
  recordTitleLabel: string;
  recordDescription: string;
  historyLabel: string;
  historyDescription: string;
};

const ApplicationDetail: React.FC<IApplicationDetailProps> = props => {
  const {
    categoryLabel,
    categories,
    reasonLabel,
    reason,
    recordTitleLabel,
    recordDescription,
    historyLabel,
    historyDescription,
  } = props;

  return (
    <PageHeader {...props} labelTextVariant="h6">
      <Box customStyle="space-y-4">
        <Box>
          <Text variant="button-md" weight="bold">
            {categoryLabel}
          </Text>

          <Box customStyle="flex flex-wrap space-x-3">
            {categories.map((category, idx) => (
              <Pill key={category + idx} label={category} active={true} customStyle="mt-3" />
            ))}
          </Box>
        </Box>

        <Divider />

        <Box customStyle="space-y-3">
          <Text variant="button-md" weight="bold">
            {reasonLabel}
          </Text>

          <Text variant="body2">{reason}</Text>
        </Box>

        <Divider />

        <Box customStyle="space-y-3">
          <Text variant="button-md" weight="bold">
            {recordTitleLabel}
          </Text>

          <Text variant="body2">{recordDescription}</Text>
        </Box>

        <Divider />

        <Box customStyle="space-y-3">
          <Text variant="button-md" weight="bold">
            {historyLabel}
          </Text>

          <Text variant="body2">{historyDescription}</Text>
        </Box>
      </Box>
    </PageHeader>
  );
};

export default ApplicationDetail;
