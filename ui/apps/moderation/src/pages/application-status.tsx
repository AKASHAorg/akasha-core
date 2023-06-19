import React from 'react';
import { useTranslation } from 'react-i18next';

import ApplicationStatus from '../components/moderator/become-moderator/application-status';

import { BasePageProps } from './dashboard';
import { ApplicationStatusType } from './overview';

import {
  applicationApprovedSubtitles,
  applicationRejectedSubtitles,
  applicationUnderReviewSubtitles,
} from '../utils';

export type ApplicationStatusPageProps = BasePageProps & {
  applicationStatus: ApplicationStatusType | null;
};

export const ApplicationStatusPage: React.FC<ApplicationStatusPageProps> = props => {
  const { applicationStatus, navigateTo } = props;

  const { t } = useTranslation('app-moderation-ewa');

  const subtitleLabelsMap = {
    [ApplicationStatusType.review]: applicationUnderReviewSubtitles,
    [ApplicationStatusType.approved]: applicationApprovedSubtitles,
    [ApplicationStatusType.rejected]: applicationRejectedSubtitles,
  };

  const subtitles = subtitleLabelsMap[applicationStatus] ?? [];

  const handleLinkClick = (link: string) => () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[link],
    });
  };

  return (
    <ApplicationStatus
      label={t('Application Status')}
      titleLabel={t('{{applicationStatus}}', { applicationStatus: applicationStatus })}
      subtitleLabels={subtitles.map(subtitle => ({
        ...subtitle,
        label: t('{{label}}', { label: subtitle.label }),
      }))}
      onLinkClick={handleLinkClick}
    />
  );
};
