import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { useGetLogin, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { ModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { JoinVibesCard } from '../components/applications/join-vibes-card';
import { SectionRenderer } from '../components/applications/section-renderer';
import routes, { APPLICATION_DETAIL, BECOME_MODERATOR, MY_APPLICATION_DETAIL } from '../routes';
import {
  generateModeratorApplicationHistory,
  generateUserApplicationHistory,
  renderChevron,
  renderDate,
  renderName,
  renderStatus,
} from '../utils';

export const Applications: React.FC<unknown> = () => {
  const { data } = useGetLogin();
  const navigate = useNavigate();
  const { navigateToModal } = useRootComponentProps();
  const _navigateToModal = React.useRef(navigateToModal);
  const { t } = useTranslation('vibes-console');

  const isLoggedIn = !!data?.id;
  const isModerator = false;

  const showLoginModal = React.useCallback(
    (redirectTo?: { modal: ModalNavigationOptions }, message?: string) => {
      _navigateToModal.current?.({
        name: 'login',
        redirectTo,
        message,
      });
    },
    [],
  );

  const handleCtaButtonClick = () => {
    if (!isLoggedIn) {
      showLoginModal();
      return;
    }
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
        to: routes[MY_APPLICATION_DETAIL],
        params: {
          applicationId,
        },
      });
    }
    return navigate({
      to: routes[APPLICATION_DETAIL],
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
        theadValues={[
          <Text key={0} variant="h6">
            {t('Applicant')}
          </Text>,
          <Text key={1} variant="h6">
            {t('Status')}
          </Text>,
        ]}
        rows={allModeratorApplicationsRows}
        onButtonClick={() => handleViewAllApplications('applications')}
      />
    </Stack>
  );
};
