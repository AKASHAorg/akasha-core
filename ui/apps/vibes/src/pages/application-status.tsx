import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import ApplicationStatus from '../components/moderator/become-moderator/application-status';

import { ApplicationStatusType, BasePageProps } from './overview';

import {
  applicationApprovedSubtitles,
  applicationRejectedSubtitles,
  applicationUnderReviewSubtitles,
} from '../utils';
import routes, { HOME } from '../routes';

export type ApplicationStatusPageProps = BasePageProps & {
  applicationStatus: ApplicationStatusType | null;
};

export const ApplicationStatusPage: React.FC<ApplicationStatusPageProps> = props => {
  const { applicationStatus, navigateTo } = props;

  const { t } = useTranslation('app-vibes');

  const contentMap = {
    [ApplicationStatusType.review]: {
      assetName: 'vibe-review',
      subtitle: applicationUnderReviewSubtitles,
    },
    [ApplicationStatusType.approved]: {
      assetName: 'vibe-approved',
      subtitle: applicationApprovedSubtitles,
    },
    [ApplicationStatusType.rejected]: {
      assetName: 'vibe-rejected',
      subtitle: applicationRejectedSubtitles,
    },
  };

  const content = contentMap[applicationStatus];

  const handleLinkClick = (link: string) => () => {
    navigateTo?.({
      appName: '@akashaorg/app-vibes',
      getNavigationUrl: routes => routes[link],
    });
  };

  // return to home page (overview) if no application status
  if (!applicationStatus) {
    return <Navigate to={routes[HOME]} replace />;
  }

  return (
    <ApplicationStatus
      label={t('Application Status')}
      assetName={content?.assetName}
      titleLabel={t('{{applicationStatus}}', { applicationStatus: applicationStatus })}
      subtitleLabels={content?.subtitle.map((subtitle: { [key: string]: string }) => ({
        ...subtitle,
        label: t('{{label}}', { label: subtitle.label }),
      }))}
      onLinkClick={handleLinkClick}
    />
  );
};
