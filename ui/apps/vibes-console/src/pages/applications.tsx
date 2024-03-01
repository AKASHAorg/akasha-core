import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { JoinVibesCard } from '../components/applications/join-vibes-card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export const Applications: React.FC<unknown> = () => {
  const { t } = useTranslation('vibes-console');
  const { getRoutingPlugin } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  const isModerator = false;

  const handleCtaButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-vibes-console',
      getNavigationUrl: () => `/applications-center/become-a-moderator`,
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
