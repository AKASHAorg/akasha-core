import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Pagination, {
  PaginationProps,
} from '@akashaorg/design-system-core/lib/components/Pagination';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Table, { TableProps } from '@akashaorg/design-system-core/lib/components/Table';

const PaginatedTable: React.FC<TableProps & PaginationProps> = props => {
  return (
    <Stack spacing="gap-y-3">
      <Card padding={0}>
        <Table {...props} />
      </Card>
      <Pagination {...props} customStyle="justify-end" />
    </Stack>
  );
};

export default PaginatedTable;
