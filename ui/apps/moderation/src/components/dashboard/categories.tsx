import React from 'react';

import CategoryPills from './category-pills';
import PageHeader, { IPageHeaderProps } from './page-header';

export type ModerationCategory = { value: string; label: string };

export interface IEditCategoriesProps extends IPageHeaderProps {
  label: string;
  selectedCategories: ModerationCategory[];
  moderationCategories: ModerationCategory[];
  allCategoriesLabel: string;
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  onCancelButtonClick: () => void;
  onConfirmButtonClick: () => void;
}

const EditCategories: React.FC<IEditCategoriesProps> = props => {
  return (
    <PageHeader {...props}>
      <CategoryPills {...props} />
    </PageHeader>
  );
};

export default EditCategories;
