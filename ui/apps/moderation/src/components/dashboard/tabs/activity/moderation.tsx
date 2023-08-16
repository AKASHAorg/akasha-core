import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Table, { TableProps } from '@akashaorg/design-system-core/lib/components/Table';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ModerationActivityProps = TableProps & {
  label: string;
};

const ModerationActivity: React.FC<ModerationActivityProps> = props => {
  const { label } = props;

  return (
    <Card padding="pt-0 px-0 pb-2">
      <Box customStyle="px-4 py-6">
        <Text variant="h5" align="center">
          {label}
        </Text>
      </Box>

      <Divider />

      <Table {...props} />
    </Card>
  );
};

export default ModerationActivity;
