import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { ButtonValues, IModerationLogItem, NavigateToParams } from '@akashaorg/typings/ui';
import { useGetCount, useInfiniteLog } from '@akashaorg/ui-awf-hooks';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Dropdown from '@akashaorg/design-system-core/lib/components/Dropdown';
import Table from '@akashaorg/design-system-core/lib/components/Table';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import Banner from '../components/transparency-log/banner';
import DetailCard from '../components/transparency-log/detail-card';
import MiniCardRenderer from '../components/transparency-log/mini-card-renderer';
import { NoItemsFound } from '../components/error-cards';

import getReasonPrefix from '../utils/getReasonPrefix';

const { styled, Icon, Spinner, TabsToolbar, StyledSwitchCardButton, useIntersectionObserver } = DS;

export interface ITransparencyLogProps {
  user: string | null;
  navigateTo: (args: NavigateToParams) => void;
}

const DEFAULT_LIMIT = 10;

export const TransparencyLog: React.FC<ITransparencyLogProps> = props => {
  const { user, navigateTo } = props;

  const [activeButton, setActiveButton] = React.useState<string>(ButtonValues.ALL);
  const [selected, setSelected] = React.useState<IModerationLogItem | null>(null);

  // list filters
  const [filterByType, setfilterByType] = React.useState(null);
  const [filterByApp, setfilterByApp] = React.useState(null);

  const { t } = useTranslation('app-moderation-ewa');

  const getCountQuery = useGetCount();
  const count = getCountQuery.data || { delisted: 0, kept: 0, pending: 0 };

  const logItemsQuery = useInfiniteLog(DEFAULT_LIMIT);
  const logItemPages = React.useMemo(() => {
    if (logItemsQuery.data) {
      return logItemsQuery.data.pages;
    }
    return [];
  }, [logItemsQuery.data]);

  const handleLoadMore = React.useCallback(() => {
    if (!logItemsQuery.isLoading && logItemsQuery.hasNextPage) {
      logItemsQuery.fetchNextPage();
    }
  }, [logItemsQuery]);

  const loadmoreRef = React.createRef<HTMLDivElement>();

  useIntersectionObserver({
    target: loadmoreRef,
    onIntersect: handleLoadMore,
    threshold: 0,
  });

  const contentTypeMap = {
    account: 'User',
    reply: 'Reply',
    post: 'Post',
  };

  const onTabClick = (value: string) => () => {
    setActiveButton(value);
  };

  const handleClickArrowLeft = () => {
    setSelected(null);
  };

  const handleClickAvatar = (pubKey: string) => () => {
    if (pubKey)
      navigateTo?.({
        appName: '@akashaorg/app-profile',
        getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${pubKey}`,
      });
  };

  const handleCardClick = (el: IModerationLogItem) => () => {
    selected?.contentID === el.contentID ? setSelected(null) : setSelected(el);
  };

  const buttonValues = [
    {
      value: ButtonValues.ALL,
      label: t('{{ buttonValueAll }}', { buttonValueAll: ButtonValues.ALL }),
    },
    {
      value: ButtonValues.KEPT,
      label: t('{{ buttonValueKept }}', { buttonValueKept: ButtonValues.KEPT }),
    },
    {
      value: ButtonValues.DELISTED,
      label: t('{{ buttonValueDelisted }}', { buttonValueDelisted: ButtonValues.DELISTED }),
    },
    {
      value: ButtonValues.STATS,
      label: t('{{ buttonValueStats }}', { buttonValueStats: ButtonValues.STATS }),
    },
  ];

  const hasKeptItems = activeButton === ButtonValues.KEPT && count.kept > 0;

  const hasDelistedItems = activeButton === ButtonValues.DELISTED && count.delisted > 0;

  const hasLoadMoreRef = hasKeptItems || hasDelistedItems || activeButton === ButtonValues.ALL;

  const shouldLoadMore = hasLoadMoreRef && logItemsQuery.isFetching && logItemPages.length > 0;

  const handleCopy = (value: string) => () => {
    navigator.clipboard.writeText(value);
  };

  const resetFilters = () => {
    setfilterByType(null);
    setfilterByApp(null);
  };

  const handleIconClick = (id: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: navRoutes => `${navRoutes['Transparency Log']}/${id}`,
    });
  };

  const trimmedRows =
    logItemsQuery.data?.pages[0]?.results?.map(el => [
      dayjs(el.moderatedDate).format('DD MMM YYYY'),
      t('{{type}}', { type: contentTypeMap[el.contentType] }),
      el.delisted ? t('Delisted') : t('Kept'),
      el.contentID,
    ]) ?? [];

  return (
    <>
      <Box customStyle="flex justify-between items-center mb-2">
        <Box customStyle="flex items-center space-x-2">
          <Dropdown
            name="filterByType"
            placeholderLabel={t('Select an option')}
            selected={filterByType}
            menuItems={[
              { id: '1', title: t('Decision 1') },
              { id: '2', title: t('Decision 2') },
            ]}
            setSelected={setfilterByType}
          />
          <Dropdown
            name="filterByApp"
            placeholderLabel={t('Select an option')}
            selected={filterByApp}
            menuItems={[
              { id: '1', title: t('App 1') },
              { id: '2', title: t('App 2') },
            ]}
            setSelected={setfilterByApp}
          />
        </Box>

        <Button plain={true} onClick={resetFilters}>
          <Text
            variant="body2"
            color={{ light: 'text-secondary-light', dark: 'text-secondary-dark' }}
          >
            {`${t('Reset')}`}
          </Text>
        </Button>
      </Box>
      <BasicCardBox pad="p-0">
        <Table
          theadValues={[t('Date'), t('Category'), t('Decision'), '']}
          rows={trimmedRows}
          hasIcons={true}
          onIconClick={handleIconClick}
        />
      </BasicCardBox>
    </>
  );
};
