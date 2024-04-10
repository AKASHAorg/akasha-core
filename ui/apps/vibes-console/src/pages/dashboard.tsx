import React from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { DashboardEntry, DashboardHeader } from '../components/dashboard';
import { generateReportEntries } from '../utils';

export const Dashboard: React.FC<unknown> = () => {
  const { t } = useTranslation('vibes-console');

  const entries = generateReportEntries();

  return (
    <Stack spacing="gap-y-3">
      <DashboardHeader
        titleLabel={t('Content Review Hub')}
        inputPlaceholderLabel={t('Search for Case#')}
        buttonLabel={t('Search')}
      />

      <Stack spacing="gap-y-3">
        {entries.map(e => (
          <DashboardEntry
            key={e.id}
            entry={e}
            caseLabel={t('Case')}
            nsfwLabel={t('Profile tagged NSFW')}
            viewProfileLabel={t('View Profile')}
            reportedForLabels={{ first: t('A'), second: t('has been reported for') }}
            lastReportLabel={t('Last Report')}
            keepButtonLabel={t('Keep')}
            suspendButtonLabel={t('Suspend')}
          />
        ))}
      </Stack>
    </Stack>
  );
};
