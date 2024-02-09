import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';

import ModeratorDetailCard from '../components/moderator';
import InfoCard from '../components/moderator/info-card';
import PaginatedTable from '../components/transparency-log/paginated-table';

import { contentTypeMap } from './transparency-log';

import { BasePageProps } from './overview';
import {
  generateModerators,
  formatDate,
  generateTenureInfoLabel,
  generateModerationHistory,
  generateDismissalReason,
} from '../utils';

export const ModeratorDetailPage: React.FC<BasePageProps> = props => {
  const { navigateTo } = props;

  const [pages] = React.useState([generateModerationHistory()]);

  const [curPage, setCurPage] = React.useState<number>(1);

  /**
   * get the profileId from parm and use this to fetch the moderator detail
   */
  const { moderatorProfileId } = useParams<{ moderatorProfileId: string }>();

  const moderator = generateModerators()[1];

  const tenureInfoLabel = generateTenureInfoLabel(moderator.status);

  const { t } = useTranslation('app-vibes');

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
      appName: '@akashaorg/app-vibes',
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

  const dismissalReason = generateDismissalReason();

  return (
    <Stack spacing="gap-y-4">
      {moderator.status === 'dismissed' && (
        <InfoCard
          titleLabel={`${t('Moderator Dismissed')} - ${t('{{title}}', {
            title: dismissalReason.title,
          })}`}
          subtitleLabel={t('{{subtitle}}', {
            subtitle: dismissalReason.subtitle,
          })}
        />
      )}

      <ModeratorDetailCard
        moderator={moderator}
        viewProfileLabel={t('View Profile')}
        moderatedLabel={t('Moderated')}
        moderatedItemsLabel={t('items')}
        tenureInfoLabel={t('{{tenureInfoLabel}}', { tenureInfoLabel })}
      />

      <PaginatedTable
        tableTitle={t('Moderation History')}
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
