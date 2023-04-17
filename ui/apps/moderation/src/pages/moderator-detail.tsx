import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { NavigateToParams } from '@akashaorg/typings/ui';
import { useInfiniteLog } from '@akashaorg/ui-awf-hooks';

import Box from '@akashaorg/design-system-core/lib/components/Box';

import ModeratorDetail from '../components/moderator';
import PaginatedTable from '../components/transparency-log/paginated-table';

import { DEFAULT_LIMIT, PaginatedItem, contentTypeMap } from './transparency-log';
import { moderators } from '../utils/dummy-data';
import { formatDate } from '../utils/format-date';

export interface IModeratorDetailPageProps {
  navigateTo: (args: NavigateToParams) => void;
}

export const ModeratorDetailPage: React.FC<IModeratorDetailPageProps> = props => {
  const { navigateTo } = props;

  const [pages, setPages] = React.useState<PaginatedItem[]>([]);

  const [curPage, setCurPage] = React.useState<number>(1);

  /**
   * get the pubkey from parm and use this to fetch the moderator detail
   */
  const { moderatorPubKey } = useParams<{ moderatorPubKey: string }>();

  const moderator = moderators[1];

  const { t } = useTranslation('app-moderation-ewa');

  const logItemsQuery = useInfiniteLog(DEFAULT_LIMIT);

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
    <Box customStyle="space-y-2">
      <ModeratorDetail
        moderator={moderator}
        viewProfileLabel={t('View Profile')}
        tenureInfoLabel={
          moderator.status === 'active'
            ? t('Moderator since')
            : t(`{{status}} on`, {
                status: moderator.status
                  ? moderator.status[0].toUpperCase() + moderator.status.slice(1)
                  : '',
              })
        }
        dismissModeratorLabel={t('Dismiss Moderator')}
        dismissModeratorDescLabel={t(
          "You can dismiss this moderator anytime if they have been inactive or if they violated AKASHA's code of conduct",
        )}
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
    </Box>
  );
};
