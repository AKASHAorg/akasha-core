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
import Pagination from '@akashaorg/design-system-core/lib/components/Pagination';
import Table from '@akashaorg/design-system-core/lib/components/Table';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import Banner from '../components/transparency-log/banner';
import DetailCard from '../components/transparency-log/detail-card';
import MiniCardRenderer from '../components/transparency-log/mini-card-renderer';
import { NoItemsFound } from '../components/error-cards';

import getReasonPrefix from '../utils/getReasonPrefix';

const { useIntersectionObserver } = DS;

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
  const [filterByDecision, setfilterByDecision] = React.useState(null);
  const [filterByCategory, setfilterByCategory] = React.useState(null);
  const [curPage, setCurPage] = React.useState<number>(1);
  const pages = 10;

  const { t } = useTranslation('app-moderation-ewa');

  const decisionPlaceholderLabel = t('Decision');
  const categoryPlaceholderLabel = t('Category');

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
    account: 'Account',
    reply: 'Reply',
    post: 'Post',
  };

  const handleClickPage = (page: number) => () => {
    setCurPage(page);
  };

  const handleClickPrev = () => {
    if (!(curPage === 1)) {
      setCurPage(curPage - 1);
    }
  };

  const handleClickNext = () => {
    if (!(curPage === pages)) {
      setCurPage(curPage + 1);
    }
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
    setfilterByDecision({
      id: '',
      iconName: null,
      title: decisionPlaceholderLabel,
    });

    setfilterByCategory({
      id: '',
      iconName: null,
      title: categoryPlaceholderLabel,
    });
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
      <Box customStyle="flex justify-between items-center mb-3">
        <Box customStyle="flex items-center space-x-3">
          <Dropdown
            name="filterByDecision"
            placeholderLabel={decisionPlaceholderLabel}
            selected={filterByDecision}
            menuItems={[
              { id: '1', title: t('Kept') },
              { id: '2', title: t('Delisted') },
              { id: '3', title: t('Suspended') },
            ]}
            setSelected={setfilterByDecision}
          />
          <Dropdown
            name="filterByCategory"
            placeholderLabel={categoryPlaceholderLabel}
            selected={filterByCategory}
            menuItems={[
              { id: '1', title: t('Post') },
              { id: '2', title: t('Reply') },
              { id: '3', title: t('Account') },
              { id: '4', title: t('Article') },
            ]}
            setSelected={setfilterByCategory}
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

      <Pagination
        customStyle="mt-3 justify-end"
        pageCount={pages}
        currentPage={curPage}
        prevButtonLabel={t('Prev')}
        nextButtonLabel={t('Next')}
        prevButtonDisabled={curPage === 1}
        nextButtonDisabled={curPage === pages}
        onClickPage={handleClickPage}
        onClickPrev={handleClickPrev}
        onClickNext={handleClickNext}
      />
    </>
  );
};
