import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IModerationLogItem } from '@akashaorg/typings/lib/ui';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Dropdown from '@akashaorg/design-system-core/lib/components/Dropdown';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import TransparencyLogItemCard from '../components/transparency-log/log-item';
import NoFlaggedItems from '../components/transparency-log/no-flagged-items';

export type PaginatedItem = IModerationLogItem[];

export const DEFAULT_LIMIT = 10;

export const TransparencyLog: React.FC<unknown> = () => {
  const { t } = useTranslation('app-vibes');

  // list filters
  const defaultDecision = 'Decision';
  const defaultCategory = 'Category';

  const [filterByDecision, setfilterByDecision] = useState(defaultDecision);
  const [filterByCategory, setfilterByCategory] = useState(defaultCategory);

  const resetFilters = () => {
    setfilterByDecision(defaultDecision);
    setfilterByCategory(defaultCategory);
  };

  const moderationEntries = [];

  const filteredEntries = moderationEntries.filter(entry => {
    if (filterByDecision && filterByCategory)
      return entry.status === filterByDecision && entry.type === filterByCategory;

    if (filterByDecision) return entry.status === filterByDecision;

    if (filterByCategory) return entry.type === filterByCategory;

    return entry;
  });

  return (
    <Stack spacing="gap-y-4">
      <Stack direction="row" align="center" justify="between">
        <Stack direction="row" align="center" spacing="gap-x-3">
          <Dropdown
            name="filterByDecision"
            placeholderLabel={defaultDecision}
            selected={filterByDecision}
            menuItems={['Kept', 'Delisted', 'Suspended']}
            setSelected={setfilterByDecision}
          />
          <Dropdown
            name="filterByCategory"
            placeholderLabel={defaultCategory}
            selected={filterByCategory}
            menuItems={['Beam', 'Reflection', 'Profile']}
            setSelected={setfilterByCategory}
          />
        </Stack>
        <Button variant="text" size="md" label={`${t('Reset')}`} onClick={resetFilters} />
      </Stack>

      {!filteredEntries.length && (
        <NoFlaggedItems noflaggedItemsLabel={t('Looks like there are no flagged items yet!')} />
      )}

      {!!filteredEntries.length && (
        <Stack spacing="gap-y-4">
          {filteredEntries.map(el => (
            <TransparencyLogItemCard
              key={el.contentId}
              item={el}
              caseLabel={t('Case')}
              reportedLabel={t('Reported')}
              resolvedLabel={t('Resolved')}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};
