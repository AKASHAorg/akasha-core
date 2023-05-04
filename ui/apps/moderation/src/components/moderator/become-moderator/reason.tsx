import React from 'react';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

import PageButtons, { IPageButtonsProps } from '../../dashboard/page-buttons';

export interface IBMSelectReasonProps extends IPageButtonsProps {
  titleLabel: string;
  subtitleLabel: string;
  reasonCaption: string;
  reasonPlaceholderLabel: string;
}

const BMSelectReason: React.FC<IBMSelectReasonProps> = props => {
  const { titleLabel, subtitleLabel, reasonCaption, reasonPlaceholderLabel } = props;

  return (
    <BasicCardBox pad="p-4">
      <Box customStyle="flex flex-col space-y-4">
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>

        <Text variant="footnotes2" weight="light">
          {subtitleLabel}
        </Text>

        <TextField caption={reasonCaption} placeholder={reasonPlaceholderLabel} type="multiline" />

        <Box customStyle="flex space-x-6 items-center justify-end">
          <PageButtons {...props} />
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default BMSelectReason;
