import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/ui';

import ModifyApplication from '../components/moderator/become-moderator/modify-application';

import { preSelectedReasons, reasons } from '../utils';
import { CHECK_APPLICATION_STATUS, HOME } from '../routes';

export interface IModifyApplicationPageProps {
  navigateTo: (args: NavigateToParams) => void;
}

export const ModifyApplicationPage: React.FC<IModifyApplicationPageProps> = props => {
  const { navigateTo } = props;

  const { t } = useTranslation('app-moderation-ewa');

  const categories = reasons.map(reason => ({
    value: reason,
    label: reason,
  }));

  const selectedCategories = preSelectedReasons.map(el => ({
    value: el,
    label: el,
  }));

  const handleCancelButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[CHECK_APPLICATION_STATUS],
    });
  };

  const handleUpdateClick = () => {
    /**
     * handle update
     */
    return navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
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
      selectedCategories={selectedCategories}
      moderationCategories={categories}
      allCategoriesLabel={t('All categories')}
      cancelButtonLabel={t('Cancel')}
      confirmButtonLabel={t('Update')}
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleUpdateClick}
    />
  );
};
