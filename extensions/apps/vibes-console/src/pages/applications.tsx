import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { IModalNavigationOptions } from '@akashaorg/typings/lib/ui';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { JoinVibesCard } from '../components/applications/join-vibes-card';
import { SectionRenderer } from '../components/applications/section-renderer';
import routes, { BECOME_MODERATOR } from '../routes';

export const Applications: React.FC<unknown> = () => {
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const navigate = useNavigate();
  const { navigateToModal } = useRootComponentProps();
  const _navigateToModal = React.useRef(navigateToModal);
  const { t } = useTranslation('vibes-console');
  const isLoggedIn = !!authenticatedDID;
  const isModerator = false;
  const showLoginModal = React.useCallback(
    (redirectTo?: { modal: IModalNavigationOptions }, message?: string) => {
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
  return (
    <Stack spacing={6}>
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
        onButtonClick={() => handleViewAllApplications('my-applications')}
      />
      <SectionRenderer
        titleLabel={t('Applications Log')}
        buttonLabel={t('View all')}
        noItemLabel={t('There are no moderator applications yet')}
        onButtonClick={() => handleViewAllApplications('applications')}
      />
    </Stack>
  );
};
