import React from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import PaginatedTable from '@akashaorg/design-system-components/lib/components/PaginatedTable';
import ModeratorDetailCard from '../components/moderator';
import InfoCard from '../components/moderator/info-card';
import { generateTenureInfoLabel, generateDismissalReason } from '../utils';
export type ModeratorDetailPageProps = {
  moderatorId: string;
};
export const ModeratorDetailPage: React.FC<ModeratorDetailPageProps> = () => {
  const [pages] = React.useState([]);
  const [curPage, setCurPage] = React.useState<number>(1);

  /**
   * get the profileId from param and use this to fetch the moderator details
   */
  // const { moderatorProfileId } = useParams<{ moderatorProfileId: string }>();
  const { t } = useTranslation('app-vibes');
  const moderator = null;
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
        tenureInfoLabel={t('{{tenureInfoLabel}}', {
          tenureInfoLabel,
        })}
      />

      <PaginatedTable
        pageCount={pages.length}
        currentPage={curPage}
        prevButtonLabel={t('Prev')}
        nextButtonLabel={t('Next')}
        prevButtonDisabled={curPage === 1}
        nextButtonDisabled={curPage === pages.length - 1}
        onClickPage={handleClickPage}
        onClickPrev={handleClickPrev}
        onClickNext={handleClickNext}
      />
    </Stack>
  );
};
