import React from 'react';
import { useTranslation } from 'react-i18next';

import { useModerationCategory } from '@akashaorg/ui-awf-hooks';

import ModifyApplication from '../components/moderator/become-moderator/modify-application';

import { BasePageProps } from './overview';
import { CHECK_APPLICATION_STATUS, HOME } from '../routes';
import { reasons } from '../utils';

export const ModifyApplicationPage: React.FC<BasePageProps> = props => {
  const { navigateTo } = props;

  const { t } = useTranslation('app-vibes');

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
      appName: '@akashaorg/app-vibes',
      getNavigationUrl: routes => routes[CHECK_APPLICATION_STATUS],
    });
  };

  const handleUpdateClick = () => {
    /**
     * handle update
     */
    return navigateTo?.({
      appName: '@akashaorg/app-vibes',
      getNavigationUrl: routes => routes[HOME],
    });
  };

  return (
    <ModifyApplication
      label={t('Modify Application')}
      reasonTitleLabel={t('Why do you want to become a moderator?')}
      reasonCaption={`${t('1000 words Max')}.`}
      reasonPlaceholderLabel={`${t('I would like to apply because')}...`}
      changeCategoryTitleLabel={t('Change Moderation Category')}
      categories={categories}
      moderationCategories={moderationCategories}
      allCategoriesLabel={allCategoriesLabel}
      allCategoriesSelected={categories.length === moderationCategories.length}
      cancelButtonLabel={t('Cancel')}
      confirmButtonLabel={t('Update')}
      onPillClick={handleCategoryClick}
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleUpdateClick}
    />
  );
};
