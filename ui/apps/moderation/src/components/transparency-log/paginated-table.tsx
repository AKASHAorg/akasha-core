import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Pagination, {
  PaginationProps,
} from '@akashaorg/design-system-core/lib/components/Pagination';
import Table, { TableProps } from '@akashaorg/design-system-core/lib/components/Table';

const PaginatedTable: React.FC<TableProps & PaginationProps> = props => {
  return (
    <>
      <Card padding={0}>
        <Table {...props} />
      </Card>

      <Pagination {...props} />
    </>
  );
};

export default PaginatedTable;
