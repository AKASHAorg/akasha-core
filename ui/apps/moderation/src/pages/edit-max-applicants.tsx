import React from 'react';
import { useTranslation } from 'react-i18next';

import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';

import EditMaxApplicants from '../components/dashboard/tabs/general/max-applicants';

import { BasePageProps } from './dashboard';
import { DASHBOARD } from '../routes';

export const EditMaxApplicantsPage: React.FC<BasePageProps> = props => {
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
        message: t('Maximum applicants limit updated successfully'),
      },
    });
  };

  return (
    <EditMaxApplicants
      label={t('Maximum Applicants')}
      introLabel={t(
        'You can change the maximum number of moderator applications so that you can have better control of the process',
      )}
      maxApplicantsLabel={t('Maximum Number of Applicants')}
      maxApplicantsPlaceholderLabel={t('Please enter maximum number of applicants')}
      cancelButtonLabel="Cancel"
      confirmButtonLabel="Update"
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleConfirmButtonClick}
    />
  );
};
