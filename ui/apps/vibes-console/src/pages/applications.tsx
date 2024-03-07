import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { JoinVibesCard } from '../components/applications/join-vibes-card';
import { SectionRenderer } from '../components/applications/section-renderer';
import routes, { BECOME_MODERATOR } from '../routes';

export const Applications: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('vibes-console');

  const isModerator = false;
  const loggedUserApplicationHistory = [];
  const allModeratorApplications = [];

  const handleCtaButtonClick = () => {
    navigate({
      to: routes[BECOME_MODERATOR],
    });
  };

  const handleViewAllApplications = () => {
    navigate({
      to: '/applications-center/applications',
    });
  };

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
        items={loggedUserApplicationHistory}
        onButtonClick={handleViewAllApplications}
      />

      <SectionRenderer
        titleLabel={t('Applications Log')}
        buttonLabel={t('View all')}
        noItemLabel={t('There are no moderator applications yet')}
        items={allModeratorApplications}
        onButtonClick={handleViewAllApplications}
      />
    </Stack>
  );
};
