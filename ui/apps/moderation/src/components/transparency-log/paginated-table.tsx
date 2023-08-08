import React from 'react';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Pagination, {
  PaginationProps,
} from '@akashaorg/design-system-core/lib/components/Pagination';
import Table, { ITableProps } from '@akashaorg/design-system-core/lib/components/Table';

const PaginatedTable: React.FC<ITableProps & PaginationProps> = props => {
  return (
    <>
      <BasicCardBox pad="p-0">
        <Table {...props} />
      </BasicCardBox>

      <Pagination {...props} />
    </>
  );
};

export default PaginatedTable;
