import React from 'react';
import { useTranslation } from 'react-i18next';

import EditContactInfo from '../components/dashboard/tabs/general/contact-info';

import { BasePageProps } from './dashboard';
import { DASHBOARD } from '../routes';

export const EditContactInfoPage: React.FC<BasePageProps> = props => {
  const { navigateTo } = props;

  const { t } = useTranslation('app-moderation-ewa');

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
    <EditContactInfo
      label={t('Contact Information')}
      usernameLabel={t('Discord Username')}
      usernamePlaceholderLabel={t('Please enter your discord username')}
      emailLabel={t('Email')}
      emailPlaceholderLabel={t('Please enter your email')}
      fillfromProfileLabel={t('Fill info from profile')}
      cancelButtonLabel="Cancel"
      confirmButtonLabel="Update"
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleConfirmButtonClick}
    />
  );
};
