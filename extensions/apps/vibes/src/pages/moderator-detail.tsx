import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { ChevronRightIcon } from 'lucide-react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
  const navigate = useNavigate();
  const moderator = null;
  const tenureInfoLabel = generateTenureInfoLabel(moderator.status);
  const handleRowClick = (itemId: string) => {
    navigate({
      to: '/history/$itemId',
      params: {
        itemId,
      },
    });
  };
  const trimmedRows =
    pages[curPage - 1]?.map(el => ({
      value: [
        <Typography key={0} variant="sm">
          {formatDate(el.moderatedDate.toISOString(), 'DD MMM YYYY')}
        </Typography>,
        <Typography key={1} variant="sm">
          {t('{{type}}', {
            type: el.type,
          })}
        </Typography>,
        <Stack key={2} direction="row" align="center" spacing="gap-x-1">
          <Stack
            customStyle={`w-2 h-2 rounded-full ${['Kept', 'Accepted'].includes(el.status) ? 'bg-success' : 'bg-errorLight dark:bg-errorDark'}`}
          />
          <Typography variant="sm">
            {t('{{status}}', {
              status: el.status,
            })}
          </Typography>
        </Stack>,
        <Stack key={3} align="end">
          <ChevronRightIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
        </Stack>,
      ],
      clickHandler: () => handleRowClick(el.contentId),
    })) ?? [];
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
