import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
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
      <Stack spacing="gap-y-4" customStyle="mb-8">
        <Text variant="footnotes2" color={{ light: 'black', dark: 'grey6' }}>
          {introLabel}
        </Text>
        <Text variant="footnotes2" color={{ light: 'black', dark: 'grey6' }}>
          {maxApplicantsLabel}
        </Text>
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
