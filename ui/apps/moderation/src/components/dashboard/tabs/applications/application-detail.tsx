import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { PageHeaderProps, PageHeader } from '../../../common';

export type ApplicationDetailProps = PageHeaderProps & {
  categoryLabel: string;
  categories: string[];
  reasonLabel: string;
  reason: string;
  recordTitleLabel: string;
  recordDescription: string;
  historyLabel: string;
  historyDescription: string;
};

const ApplicationDetail: React.FC<ApplicationDetailProps> = props => {
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
      <Stack spacing="gap-y-4">
        <Stack>
          <Text variant="button-md" weight="bold">
            {categoryLabel}
          </Text>

          <Stack spacing="gap-y-3" customStyle="flex-wrap">
            {categories.map((category, idx) => (
              <Pill key={category + idx} label={category} active={true} customStyle="mt-3" />
            ))}
          </Stack>
        </Stack>

        <Divider />

        <Stack spacing="gap-y-3">
          <Text variant="button-md" weight="bold">
            {reasonLabel}
          </Text>

          <Text variant="body2">{reason}</Text>
        </Stack>

        <Divider />

        <Stack spacing="gap-y-3">
          <Text variant="button-md" weight="bold">
            {recordTitleLabel}
          </Text>

          <Text variant="body2">{recordDescription}</Text>
        </Stack>

        <Divider />

        <Stack spacing="gap-y-3">
          <Text variant="button-md" weight="bold">
            {historyLabel}
          </Text>

          <Text variant="body2">{historyDescription}</Text>
        </Stack>
      </Stack>
    </PageHeader>
  );
};

export default ApplicationDetail;
