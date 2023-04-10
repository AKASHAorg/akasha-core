import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/ui';

import EditCategories from '../components/dashboard/categories';

import { DASHBOARD } from '../routes';
import { reasons, preSelectedReasons } from '../utils/reasons';

export interface IEditCategoriesPageProps {
  user: string | null;
  navigateTo: (args: NavigateToParams) => void;
}

export const EditCategoriesPage: React.FC<IEditCategoriesPageProps> = props => {
  const { navigateTo } = props;

  const { t } = useTranslation('app-moderation-ewa');
  const categories = reasons.map(reason => ({
    value: reason,
    label: t('{{label}}', { label: reason }),
  }));

  const selectedCategories = preSelectedReasons.map(el => ({
    value: el ?? '',
    label: t('{{el}}', { el: el ?? '' }),
  }));

  const handleCancelButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[DASHBOARD],
    });
  };

  const handleConfirmButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[DASHBOARD],
    });
  };

  return (
    <EditCategories
      categoriesLabel={t('Change Categories')}
      selectedCategories={selectedCategories}
      moderationCategories={categories}
      allCategoriesLabel={t('All categories')}
      cancelButtonLabel="Cancel"
      confirmButtonLabel="Confirm"
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleConfirmButtonClick}
    />
  );
};
