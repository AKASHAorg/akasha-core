import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

import { CategoryPills, CategoryPillsProps, PageHeaderProps, PageHeader } from '../../common';

export type ModifyApplicationProps = PageHeaderProps &
  CategoryPillsProps & {
    reasonTitleLabel: string;
    reasonPlaceholderLabel: string;
    reasonCaption: string;
    changeCategoryTitleLabel: string;
  };

const ModifyApplication: React.FC<ModifyApplicationProps> = props => {
  const { reasonTitleLabel, reasonCaption, reasonPlaceholderLabel, changeCategoryTitleLabel } =
    props;

  return (
    <PageHeader {...props}>
      <Stack spacing="gap-y-6">
        <Stack spacing="gap-y-4">
          <Text variant="h6">{reasonTitleLabel}</Text>

          <TextField
            caption={reasonCaption}
            placeholder={reasonPlaceholderLabel}
            type="multiline"
          />
        </Stack>

        <Stack spacing="gap-y-4">
          <Text variant="h6">{changeCategoryTitleLabel}</Text>

          <CategoryPills {...props} />
        </Stack>
      </Stack>
    </PageHeader>
  );
};

export default ModifyApplication;
