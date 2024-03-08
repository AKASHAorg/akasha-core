import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { JoinVibesCard } from '../components/applications/join-vibes-card';
import { SectionRenderer } from '../components/applications/section-renderer';
import routes, { BECOME_MODERATOR } from '../routes';
import {
  generateModeratorApplicationHistory,
  generateUserApplicationHistory,
  renderChevron,
  renderDate,
  renderName,
  renderStatus,
} from '../utils';

export const Applications: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('vibes-console');

  const isModerator = false;

  const handleCtaButtonClick = () => {
    navigate({
      to: routes[BECOME_MODERATOR],
    });
  };

  const handleViewAllApplications = (path: string) => {
    const route = `/applications-center/${path}`;
    navigate({
      to: route,
    });
  };

  const handleRowClick = (applicationId: string, isSelf = false) => {
    if (isSelf) {
      return navigate({
        to: '/applications-center/my-applications/$applicationId',
        params: {
          applicationId,
        },
      });
    }
    return navigate({
      to: '/applications-center/applications/$applicationId',
      params: {
        applicationId,
      },
    });
  };

  const loggedUserApplications = generateUserApplicationHistory(2);
  const allModeratorApplications = generateModeratorApplicationHistory();

  const loggedUserApplicationsRows = loggedUserApplications.map(({ id, resolvedDate, status }) => ({
    value: [renderDate(resolvedDate), renderStatus(status), renderChevron()],
    clickHandler: () => handleRowClick(id, true),
  }));

  const allModeratorApplicationsRows = allModeratorApplications.map(({ id, name, status }) => ({
    value: [renderName(name), renderStatus(status), renderChevron()],
    clickHandler: () => handleRowClick(id),
  }));

  return (
    <Stack spacing="gap-y-6">
      {/* show this card if guest or not a moderator */}
      {!isModerator && (
        <JoinVibesCard
          title={t('Join our Vibes team')}
          description={t(
            "Defend AKASHA World from harmful content. Let's create a safer space together",
          )}
          ctaButtonLabel={t('Start your application')}
          onCtaButtonClick={handleCtaButtonClick}
        />
      )}

      <SectionRenderer
        titleLabel={t('Your Applications')}
        buttonLabel={t('View all')}
        noItemLabel={t('You have no application history')}
        rows={loggedUserApplicationsRows}
        onButtonClick={() => handleViewAllApplications('my-applications')}
      />

      <SectionRenderer
        titleLabel={t('Applications Log')}
        buttonLabel={t('View all')}
        noItemLabel={t('There are no moderator applications yet')}
        customThStyle="text-left"
        theadValues={[t('Applicant'), t('Status'), ' ']}
        rows={allModeratorApplicationsRows}
        onButtonClick={() => handleViewAllApplications('applications')}
      />
    </Stack>
  );
};
