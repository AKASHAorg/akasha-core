import React from 'react';
import { useParams } from 'react-router-dom';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export const TransparencyLogItem: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();

  return (
    <BasicCardBox>
      <Text
        color={{ light: 'text-dark', dark: 'text-white' }}
      >{`Show details for ${itemId} here`}</Text>
    </BasicCardBox>
  );
};
