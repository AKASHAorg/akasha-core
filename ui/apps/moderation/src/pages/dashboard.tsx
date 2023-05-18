import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/ui';

import ModeratorDashboard from '../components/dashboard';
import GuestDashboard from '../components/dashboard/guest';

import { preSelectedReasons } from '../utils/reasons';

export interface IDashboardProps {
  user: string | null;
  isAuthorised: boolean;
  isAdmin: boolean;
  navigateTo: (args: NavigateToParams) => void;
}

export const Dashboard: React.FC<IDashboardProps> = props => {
  const { isAuthorised, isAdmin, navigateTo } = props;

  const { t } = useTranslation('app-moderation-ewa');

  const handleButtonClick = (route: string) => () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[route],
    });
  };

  // if isAdmin, add 'Applications' tab
  const tabLabels = ['General', ...(isAdmin ? ['Applications'] : []), 'Activity'];

  const descLabel = isAdmin
    ? 'You can resign anytime from your role. By resigning you will not be able anymore to receive or approve new moderator applications. Before resigning, you need to assign a new admin.'
    : 'You can resign anytime from your role. By resigning you will not be able anymore to receive and vote on reported content.';

  const role = isAdmin ? 'Admin' : 'Moderator';

  if (!isAuthorised) {
    return <GuestDashboard navigateTo={navigateTo} />;
  }

  return (
    <ModeratorDashboard
      tabLabels={tabLabels.map(label => t('{{label}}', { label }))}
      moderatorSinceLabel={t('{{role}} since', { role })}
      moderatorSince={Date.parse(new Date('01 Jan 2020').toISOString())}
      moderationCategoriesLabel={t('Moderation categories')}
      noCategoriesLabel={t('You do not have any categories selected yet.')}
      moderationCategories={preSelectedReasons.map(el => t('{{el}}', { el }))}
      contactInfoLabel={t('Contact information')}
      contactInfoIntroLabel={t(
        'By providing this information the community will be able to contact you',
      )}
      contactInfo={[
        { type: 'discord', value: 'julie#t112' },
        { type: 'message', value: 'juliet112@gmail.com' },
      ]}
      maxApplicantsLabel={t('Maximum Number of Applicant')}
      maxApplicantsIntroLabel={t(
        'You can change the maximum number of moderator applications so that you can have better control of the process',
      )}
      currentNumberLabel={t('Current number')}
      maxApplicants={65}
      moderationDutiesLabel={t('{{role}} duties', { role })}
      moderationDutiesDescLabel={t('{{descLabel}}', { descLabel })}
      changeLabel={t('Change')}
      onButtonClick={handleButtonClick}
      resignButtonLabel={t('Resign from {{role}} role', { role })}
    />
  );
};
