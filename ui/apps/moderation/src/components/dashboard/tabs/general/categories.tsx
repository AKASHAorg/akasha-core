import React from 'react';

import { PageHeader, PageHeaderProps, CategoryPills, CategoryPillsProps } from '../../../common';

export type IEditCategoriesProps = PageHeaderProps & CategoryPillsProps;

const EditCategories: React.FC<IEditCategoriesProps> = props => {
  return (
    <PageHeader {...props}>
      <CategoryPills {...props} />
    </PageHeader>
  );
};

export default EditCategories;
