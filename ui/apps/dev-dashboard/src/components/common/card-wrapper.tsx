import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Box from '@akashaorg/design-system-core/lib/components/Box';
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
    <Card padding="p-0">
      <Box customStyle="p-4">
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>
      </Box>

      <Divider />

      <>{children}</>

      <Box customStyle="flex p-4 space-x-6 items-center justify-end">
        <PageButtons {...props} />
      </Box>
    </Card>
  );
};
