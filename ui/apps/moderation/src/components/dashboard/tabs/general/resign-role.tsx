import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

import { IPageHeaderProps, PageHeader } from '../../../common';

export interface IResignRoleProps extends IPageHeaderProps {
  textLine1Label: string;
  reasonTitleLabel: string;
  reasonPlaceholderLabel: string;
  optionalLabel: string;
  textLine2Label: string;
}

const ResignRole: React.FC<IResignRoleProps> = props => {
  const {
    textLine1Label,
    reasonTitleLabel,
    reasonPlaceholderLabel,
    optionalLabel,
    textLine2Label,
  } = props;

  return (
    <PageHeader {...props}>
      <Box customStyle="space-y-4">
        <Text>{textLine1Label}</Text>

        <Box customStyle="space-y-2">
          <Box customStyle="flex space-x-2">
            <Text weight="bold">{reasonTitleLabel}</Text>
            <Text customStyle="text-[0.875rem] leading-[1.375rem] font-light">{`(${optionalLabel})`}</Text>
          </Box>

          <TextField placeholder={reasonPlaceholderLabel} type="multiline" />
        </Box>

        <Text>{textLine2Label}</Text>
      </Box>
    </PageHeader>
  );
};

export default ResignRole;
