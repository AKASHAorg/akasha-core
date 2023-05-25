import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { ModeratorApplicantData, NavigateToParams } from '@akashaorg/typings/ui';
import { useInfiniteLog } from '@akashaorg/ui-awf-hooks';

import { DEFAULT_LIMIT, PaginatedItem, contentTypeMap } from './transparency-log';
import ModeratorDashboard from '../components/dashboard';
import GuestDashboard from '../components/dashboard/guest';

import { generateApplicants, preSelectedReasons } from '../utils';
import { baseDashboardUrl } from '../routes';

export interface IDashboardProps {
  user: string | null;
  isAuthorised: boolean;
  isAdmin: boolean;
  navigateTo: (args: NavigateToParams) => void;
}

export const Dashboard: React.FC<IDashboardProps> = props => {
  const { isAuthorised, isAdmin, navigateTo } = props;

  const [pages, setPages] = useState<PaginatedItem[]>([]);

  const { t } = useTranslation('app-moderation-ewa');

  const logItemsQuery = useInfiniteLog(DEFAULT_LIMIT);

  useEffect(() => {
    if (logItemsQuery.data) {
      const results = logItemsQuery.data.pages[0].results;

      setPages([...pages, results]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logItemsQuery.data]);

  const handleButtonClick = (route: string) => () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[route],
    });
  };

  const handleClickApplicant = (applicant: ModeratorApplicantData) => () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: () => `${baseDashboardUrl}/applicant/${applicant.did.id}`,
    });
  };

  const handleClickViewAll = (activity: 'applications' | 'moderation') => () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: () => `${baseDashboardUrl}/activity/${activity}`,
    });
  };

  // if isAdmin, add 'Applications' tab
  const tabLabels = ['General', ...(isAdmin ? ['Applications'] : []), 'Activity'];

  const descLabel = isAdmin
    ? 'You can resign anytime from your role. By resigning you will not be able anymore to receive or approve new moderator applications. Before resigning, you need to assign a new admin.'
    : 'You can resign anytime from your role. By resigning you will not be able anymore to receive and vote on reported content.';

  const role = isAdmin ? 'Admin' : 'Moderator';

  const trimmedRows =
    pages[0]?.map(el => [
      dayjs(el.moderatedDate).format('DD MMM YYYY'),
      t('{{type}}', { type: contentTypeMap[el.contentType] }),
      el.delisted ? t('Delisted') : t('Kept'),
      el.contentID,
    ]) ?? [];

  if (!isAuthorised) {
    return <GuestDashboard navigateTo={navigateTo} />;
  }

  return (
    <ModeratorDashboard
      isAdmin={isAdmin}
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
      resignButtonLabel={t('Resign from {{role}} role', { role })}
      applicationsTitleLabel={t('Applications')}
      moderationTitleLabel={t('Moderation')}
      viewAllLabel={t('View All')}
      moderationRows={trimmedRows}
      onClickViewAll={handleClickViewAll}
      applicants={generateApplicants()}
      onButtonClick={handleButtonClick}
      onClickApplicant={handleClickApplicant}
    />
  );
};
