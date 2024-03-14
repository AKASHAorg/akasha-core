import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IModerationLogItem } from '@akashaorg/typings/lib/ui';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Dropdown from '@akashaorg/design-system-core/lib/components/Dropdown';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import TransparencyLogItemCard from '../components/transparency-log/log-item';
import NoFlaggedItems from '../components/transparency-log/no-flagged-items';

export type PaginatedItem = IModerationLogItem[];

export const DEFAULT_LIMIT = 10;

export const TransparencyLog: React.FC<unknown> = () => {
  const { t } = useTranslation('app-vibes');

  // list filters
  const decisionPlaceholder = t('Decision');
  const categoryPlaceholder = t('Category');

  const defaultDecision = {
    id: null,
    iconName: null,
    title: decisionPlaceholder,
  };

  const defaultCategory = {
    id: null,
    iconName: null,
    title: categoryPlaceholder,
  };

  const [filterByDecision, setfilterByDecision] = useState(defaultDecision);
  const [filterByCategory, setfilterByCategory] = useState(defaultCategory);

  const resetFilters = () => {
    setfilterByDecision(defaultDecision);
    setfilterByCategory(defaultCategory);
  };

  const moderationEntries = [];

  const filteredEntries = moderationEntries.filter(entry => {
    if (filterByDecision.id && filterByCategory.id)
      return entry.status === filterByDecision.title && entry.type === filterByCategory.title;

    if (filterByDecision.id) return entry.status === filterByDecision.title;

    if (filterByCategory.id) return entry.type === filterByCategory.title;

    return entry;
  });

  return (
    <Stack spacing="gap-y-4">
      <Stack direction="row" align="center" justify="between">
        <Stack direction="row" align="center" spacing="gap-x-3">
          <Dropdown
            name="filterByDecision"
            placeholderLabel={decisionPlaceholder}
            selected={filterByDecision}
            menuItems={[
              { id: '1', title: 'Kept' },
              { id: '2', title: 'Delisted' },
              { id: '3', title: 'Suspended' },
            ]}
            setSelected={setfilterByDecision}
          />
          <Dropdown
            name="filterByCategory"
            placeholderLabel={categoryPlaceholder}
            selected={filterByCategory}
            menuItems={[
              { id: '1', title: 'Beam' },
              { id: '2', title: 'Reflection' },
              { id: '3', title: 'Profile' },
            ]}
            setSelected={setfilterByCategory}
          />
        </Stack>

        <Button plain={true} onClick={resetFilters}>
          <Text variant="body2" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
            {`${t('Reset')}`}
          </Text>
        </Button>
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
