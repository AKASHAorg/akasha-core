import React from 'react';
import type { RootComponentProps } from '@akashaorg/typings/lib/ui';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';

const ExampleWidget: React.FC<RootComponentProps> = () => {
  return (
    <Card customStyle="flex place-self-center mt-4">
      <Text align="center">✨Hello EthBucharest!✨</Text>
    </Card>
  );
};
export default ExampleWidget;
