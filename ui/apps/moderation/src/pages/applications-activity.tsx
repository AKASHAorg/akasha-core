import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { NavigateToParams } from '@akashaorg/typings/ui';

import ApplicationsActivity from '../components/dashboard/tabs/activity/applications';

import { generateApplicationsHistory } from '../utils';

export interface IApplicationsActivityPageProps {
  navigateTo: (args: NavigateToParams) => void;
}

export const ApplicationsActivityPage: React.FC<IApplicationsActivityPageProps> = props => {
  const { navigateTo } = props;

  const { t } = useTranslation('app-moderation-ewa');

  const applications = generateApplicationsHistory();

  const applicationsRows = applications.map(el => [
    dayjs(el.reviewDate).format('DD MMM YYYY'),
    `@${el.name}`,
    el.approved ? t('Accepted') : t('Rejected'),
    el.contentID,
  ]);

  return (
    <ApplicationsActivity
      label={t('Applications Activity')}
      rows={applicationsRows}
      hasIcons={true}
      clickableRows={true}
    />
  );
};
