import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/ui';

import GuestDashboard from '../components/dashboard/guest';
import ModeratorDashboard from '../components/dashboard';

export interface IDashboardProps {
  user: string | null;
  isAuthorised: boolean;
  navigateTo: (args: NavigateToParams) => void;
}

export const Dashboard: React.FC<IDashboardProps> = props => {
  const { isAuthorised, navigateTo } = props;

  const { t } = useTranslation('app-moderation-ewa');

  // const buttonValues = [
  //   {
  //     value: ButtonValues.KEPT,
  //     label: t('{{ buttonValueKept }} items', { buttonValueKept: ButtonValues.KEPT }),
  //   },
  //   {
  //     value: ButtonValues.DELISTED,
  //     label: t('{{ buttonValueDelisted }} items', { buttonValueDelisted: ButtonValues.DELISTED }),
  //   },
  // ];

  const handleButtonClick = (route: string) => () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[route],
    });
  };
  if (!isAuthorised) {
    return <GuestDashboard navigateTo={navigateTo} />;
  }

  const categories = [
    'Threats of violence and incitement',
    'Bullying and harassment',
    'Illegal or certain regulated goods or services',
  ];

  return (
    <ModeratorDashboard
      tabLabels={[t('{{tab1}}', { tab1: 'General' }), t('{{tab2}}', { tab2: 'Activity' })]}
      moderatorSinceLabel={t('Moderator since')}
      moderationCategoriesLabel={t('Moderation categories')}
      moderationCategories={categories.map(el => t('{{el}}', el))}
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
