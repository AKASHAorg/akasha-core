import React, { PropsWithChildren } from 'react';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text, { TextProps } from '@akashaorg/design-system-core/lib/components/Text';

import { PageButtons, IPageButtonsProps } from './page-buttons';

export interface IPageHeaderProps extends IPageButtonsProps {
  label: string;
  labelTextVariant?: TextProps['variant'];
}

export const PageHeader: React.FC<PropsWithChildren<IPageHeaderProps>> = props => {
  const { labelTextVariant = 'h5', label, children } = props;

  return (
    <BasicCardBox pad="p-0">
      <Box customStyle="px-4 py-6">
        <Text variant={labelTextVariant} align="center">
          {label}
        </Text>
      </Box>

      <Divider />

      <Box customStyle="p-4">{children}</Box>

      <Box customStyle="flex space-x-6 items-center justify-end p-4 my-2">
        <PageButtons {...props} />
      </Box>
    </BasicCardBox>
  );
};
