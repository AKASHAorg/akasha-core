import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/ui';

import ModeratorDashboard from '../components/dashboard';
import GuestDashboard from '../components/dashboard/guest';

import { preSelectedReasons } from '../utils/reasons';

export interface IDashboardProps {
  user: string | null;
  isAuthorised: boolean;
  navigateTo: (args: NavigateToParams) => void;
}

export const Dashboard: React.FC<IDashboardProps> = props => {
  const { isAuthorised, navigateTo } = props;

  const { t } = useTranslation('app-moderation-ewa');

  const handleButtonClick = (route: string) => () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[route],
    });
  };

  if (!isAuthorised) {
    return <GuestDashboard navigateTo={navigateTo} />;
  }

  return (
    <ModeratorDashboard
      tabLabels={[t('{{tab1}}', { tab1: 'General' }), t('{{tab2}}', { tab2: 'Activity' })]}
      moderatorSinceLabel={t('Moderator since')}
      moderatorSince={Date.parse(new Date('01 Jan 2020').toISOString())}
      moderationCategoriesLabel={t('Moderation categories')}
      noCategoriesLabel={t('You do not have any categories selected yet.')}
      moderationCategories={preSelectedReasons.map(el => t('{{el}}', { el }))}
      contactInfoLabel={t('Contact info')}
      contactInfo={[
        { type: 'discord', value: 'julie#t112' },
        { type: 'message', value: 'juliet112@gmail.com' },
      ]}
      moderationDutiesLabel={t('Moderation duties')}
      moderationDutiesDescLabel={t(
        'You can resign anytime from your role. By resigning you will not be able anymore to receive and vote on reported content.',
      )}
      changeLabel={t('Change')}
      onButtonClick={handleButtonClick}
      resignButtonLabel={t('Resign from moderator role')}
    />
  );
};
