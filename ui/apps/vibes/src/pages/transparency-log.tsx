import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { IModerationLogItem } from '@akashaorg/typings/lib/ui';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Dropdown from '@akashaorg/design-system-core/lib/components/Dropdown';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { BasePageProps } from './overview';
import PaginatedTable from '../components/transparency-log/paginated-table';
import NoFlaggedItems from '../components/transparency-log/no-flagged-items';

import { generateModerationHistory } from '../utils';

export type PaginatedItem = IModerationLogItem[];

export const DEFAULT_LIMIT = 10;

export const contentTypeMap = {
  profile: 'Profile',
  reflect: 'Reflect',
  beam: 'Beam',
};

export const TransparencyLog: React.FC<BasePageProps> = props => {
  const { navigateTo } = props;

  const [pages, setPages] = useState<PaginatedItem[]>([]);

  // list filters
  const [filterByDecision, setfilterByDecision] = useState(null);
  const [filterByCategory, setfilterByCategory] = useState(null);
  const [curPage, setCurPage] = useState<number>(1);

  const { t } = useTranslation('app-vibes');

  const decisionPlaceholderLabel = t('Decision');
  const categoryPlaceholderLabel = t('Category');

  const logItemsQuery = { data: null };

  useEffect(() => {
    if (logItemsQuery.data) {
      const results = logItemsQuery.data.pages[0].results;

      setPages([...pages, results]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logItemsQuery.data]);

  const handleClickPage = (page: number) => () => {
    setCurPage(page);
  };

  const handleClickPrev = () => {
    if (!(curPage === 1)) {
      setCurPage(curPage - 1);
    }
  };

  const handleClickNext = () => {
    if (!(curPage === pages.length - 1)) {
      setCurPage(curPage + 1);
    }
  };

  const resetFilters = () => {
    setfilterByDecision({
      id: '',
      iconName: null,
      title: decisionPlaceholderLabel,
    });

    setfilterByCategory({
      id: '',
      iconName: null,
      title: categoryPlaceholderLabel,
    });
  };

  const handleRowClick = (id: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-vibes',
      getNavigationUrl: navRoutes => `${navRoutes['Transparency Log']}/${id}`,
    });
  };

  const moderationEntries = generateModerationHistory();

  const trimmedRows = moderationEntries.map(el => [
    dayjs(el.moderatedDate).format('DD MMM YYYY'),
    t('{{type}}', { type: contentTypeMap[el.contentType] }),
    el.delisted ? t('Delisted') : t('Kept'),
    el.contentID,
  ]);

  return (
    <Card elevation="1" radius={16} padding="p-4">
      <Stack spacing="gap-y-4">
        <Stack direction="row" align="center" justify="between">
          <Stack direction="row" align="center" spacing="gap-x-3">
            <Dropdown
              name="filterByDecision"
              placeholderLabel={decisionPlaceholderLabel}
              selected={filterByDecision}
              menuItems={[
                { id: '1', title: t('Kept') },
                { id: '2', title: t('Delisted') },
                { id: '3', title: t('Suspended') },
              ]}
              setSelected={setfilterByDecision}
            />
            <Dropdown
              name="filterByCategory"
              placeholderLabel={categoryPlaceholderLabel}
              selected={filterByCategory}
              menuItems={[
                { id: '1', title: t('Post') },
                { id: '2', title: t('Reply') },
                { id: '3', title: t('Account') },
                { id: '4', title: t('Article') },
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

        {trimmedRows.length && (
          <NoFlaggedItems noflaggedItemsLabel={t('Looks like there are no flagged items yet!')} />
        )}

        {!trimmedRows.length && (
          <PaginatedTable
            theadValues={[t('Date'), t('Category'), t('Decision'), '']}
            rows={trimmedRows}
            hasIcons={true}
            clickableRows={true}
            customStyle="mt-3 justify-end"
            pageCount={pages.length}
            currentPage={curPage}
            prevButtonLabel={t('Prev')}
            nextButtonLabel={t('Next')}
            prevButtonDisabled={curPage === 1}
            nextButtonDisabled={curPage === pages.length - 1}
            onRowClick={handleRowClick}
            onClickPage={handleClickPage}
            onClickPrev={handleClickPrev}
            onClickNext={handleClickNext}
          />
        )}
      </Stack>
    </Card>
  );
};
