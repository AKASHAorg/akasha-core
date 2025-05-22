import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Input } from '@akashaorg/ui/lib/akasha-components/input';
import {
  PageHeader,
  PageHeaderProps,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
export type MaxApplicantsProps = PageHeaderProps & {
  introLabel: string;
  maxApplicantsLabel: string;
  maxApplicantsPlaceholderLabel: string;
};
export const MaxApplicants: React.FC<MaxApplicantsProps> = props => {
  const { introLabel, maxApplicantsLabel, maxApplicantsPlaceholderLabel } = props;
  return (
    <PageHeader {...props}>
      <Stack spacing={4} className="mb-8">
        <Typography variant="xs" className="font-medium text-black dark:text-grey6">
          {introLabel}
        </Typography>
        <Typography variant="xs" className="font-medium text-black dark:text-grey6">
          {maxApplicantsLabel}
        </Typography>
        <Input
          placeholder={maxApplicantsPlaceholderLabel}
          onChange={() => {
            /** */
          }}
        />
      </Stack>
    </PageHeader>
  );
};
