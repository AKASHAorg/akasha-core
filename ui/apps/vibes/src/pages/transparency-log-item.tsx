import React from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { generateModerationHistory, generateModerators, generateTenureInfoLabel } from '../utils';
import ModeratorDetailCard from '../components/moderator';
import TransparencyLogItemCard from '../components/transparency-log/log-item';

export const TransparencyLogItem: React.FC<unknown> = () => {
  /**
   * get the itemId from param and use this to fetch the log item details
   */
  // const { itemId } = useParams<{ itemId: string }>();
  const { t } = useTranslation('app-vibes');

  const moderator = generateModerators()[1];
  const transparencyLogItems = generateModerationHistory();
  const randomisedItem =
    transparencyLogItems[Math.floor(Math.random() * transparencyLogItems.length)];

  const tenureInfoLabel = generateTenureInfoLabel(moderator.status);

  return (
    <Stack spacing="gap-y-4">
      <ModeratorDetailCard
        moderator={moderator}
        viewProfileLabel={t('View Profile')}
        moderatedLabel={t('Moderated')}
        moderatedItemsLabel={t('items')}
        tenureInfoLabel={t('{{tenureInfoLabel}}', { tenureInfoLabel })}
      />

      <TransparencyLogItemCard
        item={randomisedItem}
        caseLabel={t('Case')}
        reportedLabel={t('Reported')}
        resolvedLabel={t('Resolved')}
      />
    </Stack>
  );
};
