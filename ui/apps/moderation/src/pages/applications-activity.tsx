import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/ui';

import ApplicationsActivity from '../components/dashboard/tabs/activity/applications';

export interface IApplicationsActivityPageProps {
  navigateTo: (args: NavigateToParams) => void;
}

export const ApplicationsActivityPage: React.FC<IApplicationsActivityPageProps> = props => {
  const { navigateTo } = props;

  const { t } = useTranslation('app-moderation-ewa');

  return <ApplicationsActivity label={t('Applications Activity')} />;
};
