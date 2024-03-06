import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { JoinVibesCard } from '../components/applications/join-vibes-card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import routes, { BECOME_MODERATOR } from '../routes';

export const Applications: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('vibes-console');

  const isModerator = false;

  const handleCtaButtonClick = () => {
    navigate({
      to: routes[BECOME_MODERATOR],
    });
  };

  return (
    <Stack spacing="gap-y-4">
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
    </Stack>
  );
};
