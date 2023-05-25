import React from 'react';

import { PageHeader, IPageHeaderProps, CategoryPills, ICategoryPillsProps } from '../../../common';

export type IEditCategoriesProps = IPageHeaderProps & ICategoryPillsProps;

const EditCategories: React.FC<IEditCategoriesProps> = props => {
  return (
    <PageHeader {...props}>
      <CategoryPills {...props} />
    </PageHeader>
  );
};

export default EditCategories;
