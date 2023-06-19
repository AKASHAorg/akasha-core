import React from 'react';

import { PageHeader, PageHeaderProps, CategoryPills, CategoryPillsProps } from '../../../common';

export type EditCategoriesProps = PageHeaderProps & CategoryPillsProps;

const EditCategories: React.FC<EditCategoriesProps> = props => {
  return (
    <PageHeader {...props}>
      <CategoryPills {...props} />
    </PageHeader>
  );
};

export default EditCategories;
