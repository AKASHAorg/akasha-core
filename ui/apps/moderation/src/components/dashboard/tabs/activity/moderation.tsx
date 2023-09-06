import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Table, { TableProps } from '@akashaorg/design-system-core/lib/components/Table';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ModerationActivityProps = TableProps & {
  label: string;
};

const ModerationActivity: React.FC<ModerationActivityProps> = props => {
  const { label } = props;

  return (
    <Card customStyle="pt-0 px-0 pb-2">
      <Stack padding="px-4 py-6">
        <Text variant="h5" align="center">
          {label}
        </Text>
      </Stack>

      <Divider />

      <Table {...props} />
    </Card>
  );
};

export default ModerationActivity;
