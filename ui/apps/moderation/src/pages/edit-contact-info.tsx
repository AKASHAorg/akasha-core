import React from 'react';
import { useTranslation } from 'react-i18next';

import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';

import EditContactInfo from '../components/dashboard/tabs/general/contact-info';

import { BasePageProps } from './dashboard';
import { DASHBOARD } from '../routes';

export const EditContactInfoPage: React.FC<BasePageProps> = props => {
  const { navigateTo } = props;

  const { uiEvents } = useRootComponentProps();

  const { t } = useTranslation('app-moderation-ewa');

  const handleCancelButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[DASHBOARD],
    });
  };

  const handleConfirmButtonClick = () => {
    uiEvents.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Success,
        message: t('Information updated successfully'),
      },
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
