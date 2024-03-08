import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ChevronRightIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import PaginatedTable from '@akashaorg/design-system-components/lib/components/PaginatedTable';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import ModeratorDetailCard from '../components/moderator';
import InfoCard from '../components/moderator/info-card';

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
        <Text key={0} variant="body2">
          {formatDate(el.moderatedDate.toISOString(), 'DD MMM YYYY')}
        </Text>,

        <Text key={1} variant="body2">
          {t('{{type}}', { type: el.type })}
        </Text>,

        <Stack key={2} direction="row" align="center" spacing="gap-x-1">
          <Stack
            customStyle={`w-2 h-2 rounded-full ${
              ['Kept', 'Accepted'].includes(el.status)
                ? 'bg-success'
                : 'bg(errorLight dark:errorDark)'
            }`}
          />
          <Text variant="body2">{t('{{status}}', { status: el.status })}</Text>
        </Stack>,

        <Stack key={3} align="end">
          <Icon icon={<ChevronRightIcon />} accentColor={true} />
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
        tenureInfoLabel={t('{{tenureInfoLabel}}', { tenureInfoLabel })}
      />

      <PaginatedTable
        tableTitle={t('Moderation History')}
        rows={trimmedRows}
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
