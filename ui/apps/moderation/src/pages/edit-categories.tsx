import React from 'react';
import { useTranslation } from 'react-i18next';

import { useModerationCategory } from '@akashaorg/ui-awf-hooks';

import EditCategories from '../components/dashboard/tabs/general/categories';

import { BasePageProps } from './dashboard';
import { DASHBOARD } from '../routes';
import { reasons } from '../utils/reasons';

export const EditCategoriesPage: React.FC<BasePageProps> = props => {
  const { navigateTo } = props;

  const { t } = useTranslation('app-moderation-ewa');

  const moderationCategories = reasons.map(({ title }) => ({
    value: title,
    label: t('{{title}}', { title }),
  }));

  const allCategoriesLabel = t('All Categories');

  const { categories, handleCategoryClick } = useModerationCategory({
    moderationCategories,
    allCategoriesLabel,
  });

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
      label={t('Change Categories')}
      categories={categories}
      moderationCategories={moderationCategories}
      allCategoriesLabel={allCategoriesLabel}
      allCategoriesSelected={categories.length === moderationCategories.length}
      cancelButtonLabel={t('Cancel')}
      confirmButtonLabel={t('Confirm')}
      onPillClick={handleCategoryClick}
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleConfirmButtonClick}
    />
  );
};
