import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/ui';

import EditMaxApplicants from '../components/dashboard/max-applicants';

import { DASHBOARD } from '../routes';

export interface IEditMaxApplicantsPageProps {
  user: string | null;
  navigateTo: (args: NavigateToParams) => void;
}

export const EditMaxApplicantsPage: React.FC<IEditMaxApplicantsPageProps> = props => {
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
