import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

import { CategoryPills, ICategoryPillsProps, IPageHeaderProps, PageHeader } from '../../common';

export interface IModifyApplicationProps extends IPageHeaderProps {
  reasonTitleLabel: string;
  reasonPlaceholderLabel: string;
  reasonCaption: string;
  changeCategoryTitleLabel: string;
}

const ModifyApplication: React.FC<IModifyApplicationProps & ICategoryPillsProps> = props => {
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
