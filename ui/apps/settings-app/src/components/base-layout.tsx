import React, { PropsWithChildren } from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IBaseLayout {
  title: string;
}

const BaseLayout: React.FC<PropsWithChildren<IBaseLayout>> = props => {
  const { title, children } = props;
  return (
    <Card padding="p-0">
      <Box customStyle="p-4 border(b-1 solid grey8 dark:grey5)">
        <Text variant="h5" align="center">
          {title}
        </Text>
      </Box>

      {children}
    </Card>
  );
};

export default BaseLayout;
