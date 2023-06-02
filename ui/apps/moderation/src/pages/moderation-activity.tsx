import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import { useInfiniteLog } from '@akashaorg/ui-awf-hooks';

import { PaginatedItem, DEFAULT_LIMIT, contentTypeMap } from './transparency-log';

import ModerationActivity from '../components/dashboard/tabs/activity/moderation';

import { BasePageProps } from './dashboard';

export const ModerationActivityPage: React.FC<BasePageProps> = props => {
  const { navigateTo } = props;

  const [pages, setPages] = useState<PaginatedItem[]>([]);

  const { t } = useTranslation('app-moderation-ewa');

  const logItemsQuery = useInfiniteLog(DEFAULT_LIMIT);

  useEffect(() => {
    if (logItemsQuery.data) {
      const results = logItemsQuery.data.pages[0].results;

      setPages([...pages, results]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logItemsQuery.data]);

  const handleRowClick = (id: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: navRoutes => `${navRoutes['Transparency Log']}/${id}`,
    });
  };

  const moderationRows =
    pages[0]?.map(el => [
      dayjs(el.moderatedDate).format('DD MMM YYYY'),
      t('{{type}}', { type: contentTypeMap[el.contentType] }),
      el.delisted ? t('Delisted') : t('Kept'),
      el.contentID,
    ]) ?? [];

  return (
    <ModerationActivity
      label={t('Moderation Activity')}
      rows={moderationRows}
      hasIcons={true}
      clickableRows={true}
      onRowClick={handleRowClick}
    />
  );
};
