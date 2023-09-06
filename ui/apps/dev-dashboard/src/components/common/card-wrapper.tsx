import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  PageButtons,
  PageButtonsProps,
} from '@akashaorg/design-system-components/lib/components/PageButtons';

export type ICardWrapperProps = PageButtonsProps & {
  titleLabel: string;
};

export const CardWrapper: React.FC<React.PropsWithChildren<ICardWrapperProps>> = props => {
  const { titleLabel, children } = props;

  return (
    <Card padding={0}>
      <Stack padding="p-4">
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>
      </Stack>

      <Divider />

      <>{children}</>

      <Stack spacing="gap-x-6" align="center" justify="end" padding="p-4">
        <PageButtons {...props} />
      </Stack>
    </Card>
  );
};
