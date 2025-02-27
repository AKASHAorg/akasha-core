import React, { PropsWithChildren } from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IBaseLayout {
  title: string;
}

const BaseLayout: React.FC<PropsWithChildren<IBaseLayout>> = props => {
  const { title, children } = props;
  return (
    <Card className="shadow-none p-0 mb-4">
      <Stack className="p-4 border-b border-border">
        <Text variant="h5" align="center">
          {title}
        </Text>
      </Stack>

      {children}
    </Card>
  );
};

export default BaseLayout;
