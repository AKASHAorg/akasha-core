import React, { PropsWithChildren } from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
    <Card padding={0}>
      <Stack padding="px-4 py-6">
        <Text variant={labelTextVariant} align="center">
          {label}
        </Text>
      </Stack>

      <Divider />

      <Stack padding="p-4">{children}</Stack>

      {/* show buttons only when the labels are specified */}
      {(cancelButtonLabel || confirmButtonLabel) && (
        <Stack align="center" justify="end" spacing="gap-x-6" customStyle="p-4 my-2">
          <PageButtons {...props} />
        </Stack>
      )}
    </Card>
  );
};
