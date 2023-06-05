import React from 'react';
import { useTranslation } from 'react-i18next';

import EditMaxApplicants from '../components/dashboard/tabs/general/max-applicants';

import { BasePageProps } from './dashboard';
import { DASHBOARD } from '../routes';

export const EditMaxApplicantsPage: React.FC<BasePageProps> = props => {
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
