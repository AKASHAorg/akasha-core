import React from 'react';

import { PageHeader, IPageHeaderProps, CategoryPills, ICategoryPillsProps } from '../../../common';

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
