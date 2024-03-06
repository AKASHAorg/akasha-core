import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import ModeratorDetailCard from '../components/moderator';
import InfoCard from '../components/moderator/info-card';
import PaginatedTable from '../components/transparency-log/paginated-table';

import {
  generateModerators,
  generateTenureInfoLabel,
  generateModerationHistory,
  generateDismissalReason,
} from '../utils';

export type ModeratorDetailPageProps = {
  moderatorId: string;
};

export const ModeratorDetailPage: React.FC<ModeratorDetailPageProps> = () => {
  const [pages] = React.useState([generateModerationHistory()]);
  const [curPage, setCurPage] = React.useState<number>(1);

  /**
   * get the profileId from param and use this to fetch the moderator details
   */
  // const { moderatorProfileId } = useParams<{ moderatorProfileId: string }>();
  const { t } = useTranslation('app-vibes');
  const navigate = useNavigate();

  const moderator = generateModerators()[1];

  const tenureInfoLabel = generateTenureInfoLabel(moderator.status);

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
    navigate({
      to: '/history/$itemId',
      params: {
        itemId: id,
      },
    });
  };

  const trimmedRows =
    pages[curPage - 1]?.map(el => [
      formatDate(el.moderatedDate.toISOString(), 'DD MMM YYYY'),
      t('{{type}}', { type: el.type }),
      t('{{status}}', { status: el.status }),
      el.contentId,
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
