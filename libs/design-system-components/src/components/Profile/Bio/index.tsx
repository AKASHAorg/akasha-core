import React from 'react';

import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type BioProps = {
  title: string;
  biography: string;
};
const Bio: React.FC<BioProps> = ({ title, biography }) => {
  return (
    <Card className={'p-4'}>
      <Stack direction="column" spacing={2}>
        <Text variant="label">{title}</Text>
        <Text variant="body2" breakWord>
          {biography}
        </Text>
      </Stack>
    </Card>
  );
};
export default Bio;
