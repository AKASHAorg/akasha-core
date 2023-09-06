import React, { PropsWithChildren } from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IBaseLayout {
  title: string;
}

const BaseLayout: React.FC<PropsWithChildren<IBaseLayout>> = props => {
  const { title, children } = props;
  return (
    <Card padding={0}>
      <Stack padding="p-4" customStyle="border(b-1 solid grey8 dark:grey5)">
        <Text variant="h5" align="center">
          {title}
        </Text>
      </Stack>

      {children}
    </Card>
  );
};

export default BaseLayout;
