import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
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
        <TextField
          label={`${maxApplicantsLabel}.`}
          placeholder={maxApplicantsPlaceholderLabel}
          type="text"
        />
      </Stack>
    </PageHeader>
  );
};
