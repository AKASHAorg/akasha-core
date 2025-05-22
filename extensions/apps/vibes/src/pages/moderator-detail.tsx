import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@akashaorg/ui/lib/akasha-components/pagination';
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
    <Stack spacing={4}>
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
      {/* update design or add pagination to the table, if needed */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Stack>
  );
};
