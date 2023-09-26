import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type BioProps = {
  title: string;
  biography: string;
};
const Bio: React.FC<BioProps> = ({ title, biography }) => {
  return (
    <Card elevation="1" radius={20} padding={'p-4'}>
      <Stack direction="column" spacing="gap-y-2.5">
        <Text variant="label">{title}</Text>
        <Text variant="body2">{biography}</Text>
      </Stack>
    </Card>
  );
};
export default Bio;
