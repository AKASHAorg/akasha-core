import React from 'react';

import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Pagination, {
  PaginationProps,
} from '@akashaorg/design-system-core/lib/components/Pagination';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Table, { TableProps } from '@akashaorg/design-system-core/lib/components/Table';

/**
 * Component used in the vibes app for data presentation
 */
const PaginatedTable: React.FC<TableProps & PaginationProps> = props => {
  return (
    <Stack spacing={3}>
      <Card className="p-0">
        <Table {...props} />
      </Card>
      <Pagination {...props} customStyle="justify-end" />
    </Stack>
  );
};

export default PaginatedTable;
