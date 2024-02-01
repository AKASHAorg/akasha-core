import React from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import ModeratorDetailCard from '../components/moderator';
import PaginatedTable from '../components/transparency-log/paginated-table';

import { PaginatedItem, contentTypeMap } from './transparency-log';

import { BasePageProps } from './overview';
import { generateModerators, formatDate, generateTenureInfoLabel } from '../utils';

export const ModeratorDetailPage: React.FC<BasePageProps> = props => {
  const { navigateTo } = props;

  const [pages, setPages] = React.useState<PaginatedItem[]>([]);

  const [curPage, setCurPage] = React.useState<number>(1);

  const moderator = generateModerators()[1];

  const tenureInfoLabel = generateTenureInfoLabel(moderator.status);

  const { t } = useTranslation('app-moderation-ewa');

  const logItemsQuery = { data: null };

  React.useEffect(() => {
    if (logItemsQuery.data) {
      const results = logItemsQuery.data.pages[0].results;

      setPages([...pages, results]);

      // logItemsQuery.fetchNextPage();
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

  const handleRowClick = (id: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: navRoutes => `${navRoutes['Transparency Log']}/${id}`,
    });
  };

  const trimmedRows =
    pages[curPage - 1]?.map(el => [
      formatDate(el.moderatedDate, 'DD MMM YYYY'),
      t('{{type}}', { type: contentTypeMap[el.contentType] }),
      el.delisted ? t('Delisted') : t('Kept'),
      el.contentID,
    ]) ?? [];

  return (
    <Stack spacing="gap-y-4">
      <ModeratorDetailCard
        moderator={moderator}
        viewProfileLabel={t('View Profile')}
        tenureInfoLabel={t('{{tenureInfoLabel}}', { tenureInfoLabel })}
      />

      <PaginatedTable
        tableTitle={t('Moderation Activity')}
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
    </Stack>
  );
};
