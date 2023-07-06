import React, { PropsWithChildren } from 'react';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text, { TextProps } from '@akashaorg/design-system-core/lib/components/Text';
import {
  PageButtons,
  PageButtonsProps,
} from '@akashaorg/design-system-components/lib/components/PageButtons';

export type PageHeaderProps = PageButtonsProps & {
  label: string;
  labelTextVariant?: TextProps['variant'];
};

export const PageHeader: React.FC<PropsWithChildren<PageHeaderProps>> = props => {
  const { labelTextVariant = 'h5', label, cancelButtonLabel, confirmButtonLabel, children } = props;

  return (
    <BasicCardBox pad="p-0">
      <Box customStyle="px-4 py-6">
        <Text variant={labelTextVariant} align="center">
          {label}
        </Text>
      </Box>

      <Divider />

      <Box customStyle="p-4">{children}</Box>

      {/* show buttons only when the labels are specified */}
      {(cancelButtonLabel || confirmButtonLabel) && (
        <Box customStyle="flex space-x-6 items-center justify-end p-4 my-2">
          <PageButtons {...props} />
        </Box>
      )}
    </BasicCardBox>
  );
};
