import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

import { PageHeaderProps, PageHeader } from '../../../common';

export type EditMaxApplicantsProps = PageHeaderProps & {
  introLabel: string;
  maxApplicantsLabel: string;
  maxApplicantsPlaceholderLabel: string;
};

const EditMaxApplicants: React.FC<EditMaxApplicantsProps> = props => {
  const { introLabel, maxApplicantsLabel, maxApplicantsPlaceholderLabel } = props;

  return (
    <PageHeader {...props}>
      <Stack spacing="gap-y-4">
        <Text variant="footnotes2" color={{ light: 'black', dark: 'grey6' }}>
          {introLabel}
        </Text>

        <TextField
          label={maxApplicantsLabel}
          placeholder={maxApplicantsPlaceholderLabel}
          type="text"
        />
      </Stack>
    </PageHeader>
  );
};

export default EditMaxApplicants;
