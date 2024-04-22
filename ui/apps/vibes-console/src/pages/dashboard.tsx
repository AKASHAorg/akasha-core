import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import VibesConsoleContentCard from '@akashaorg/design-system-components/lib/components/VibesConsoleContentCard';
import { DashboardHeader } from '../components/dashboard';
import { generateReportEntries } from '../utils';
import routes, { REVIEW_ITEM, SETTINGS } from '../routes';

export const Dashboard: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('vibes-console');

  const entries = generateReportEntries();

  const handleSettingsButtonClick = () => {
    navigate({
      to: routes[SETTINGS],
    });
  };

  const handleButtonClick = (action: string, itemType: string, id: string) => () => {
    navigate({
      to: routes[REVIEW_ITEM],
      params: { action, itemType, id },
    });
  };

  return (
    <Stack spacing="gap-y-3">
      <DashboardHeader
        titleLabel={t('Content Review Hub')}
        inputPlaceholderLabel={t('Search for Case#')}
        buttonLabel={t('Search')}
        onSettingsButtonClick={handleSettingsButtonClick}
      />

      <Stack spacing="gap-y-3">
        {entries.map(e => (
          <VibesConsoleContentCard
            key={e.id}
            entry={e}
            caseLabel={t('Case')}
            nsfwLabel={t('Profile tagged NSFW')}
            viewProfileLabel={t('View Profile')}
            reportedForLabels={{ first: t('A'), second: t('has been reported for') }}
            lastReportLabel={t('Last Report')}
            primaryButtonLabel={t('Keep')}
            secondaryButtonLabel={e.itemType === 'Profile' ? t('Suspend') : t('Delist')}
            onButtonClick={handleButtonClick}
          />
        ))}
      </Stack>
    </Stack>
  );
};
