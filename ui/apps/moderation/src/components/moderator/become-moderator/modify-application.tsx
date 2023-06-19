import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
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
      <Box customStyle="space-y-6">
        <Box customStyle="space-y-4">
          <Text variant="h6">{reasonTitleLabel}</Text>

          <TextField
            caption={reasonCaption}
            placeholder={reasonPlaceholderLabel}
            type="multiline"
          />
        </Box>

        <Box customStyle="space-y-4">
          <Text variant="h6">{changeCategoryTitleLabel}</Text>

          <CategoryPills {...props} />
        </Box>
      </Box>
    </PageHeader>
  );
};

export default ModifyApplication;
