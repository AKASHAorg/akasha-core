import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IModerationLogItem } from '@akashaorg/typings/lib/ui';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@akashaorg/ui/lib/components/select';
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

  const [filterByDecision, setfilterByDecision] = useState('');
  const [filterByCategory, setfilterByCategory] = useState('');

  const resetFilters = () => {
    setfilterByDecision('');
    setfilterByCategory('');
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
          <Select
            name="filterByDecision"
            value={filterByDecision}
            onValueChange={setfilterByDecision}
          >
            <SelectTrigger className="grow text-foreground">
              <SelectValue placeholder={defaultDecision} />
            </SelectTrigger>
            <SelectContent>
              {['Kept', 'Delisted', 'Suspended'].map(item => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            name="filterByCategory"
            value={filterByCategory}
            onValueChange={setfilterByCategory}
          >
            <SelectTrigger className="grow text-foreground">
              <SelectValue placeholder={defaultCategory} />
            </SelectTrigger>
            <SelectContent>
              {['Beam', 'Reflection', 'Profile'].map(item => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Stack>
        <Button variant="link" onClick={resetFilters}>
          {t('Reset')}
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
