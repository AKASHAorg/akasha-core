import React from 'react';

import CategoryPills, { ICategoryPillsProps } from './category-pills';
import PageHeader, { IPageHeaderProps } from './page-header';

export interface IEditCategoriesProps extends IPageHeaderProps {
  label: string;
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  onCancelButtonClick: () => void;
  onConfirmButtonClick: () => void;
}

const EditCategories: React.FC<IEditCategoriesProps & ICategoryPillsProps> = props => {
  return (
    <PageHeader {...props}>
      <CategoryPills {...props} />
    </PageHeader>
  );
};

export default EditCategories;
