import React from 'react';
import { useTranslation } from 'react-i18next';

import getSDK from '@akashaproject/awf-sdk';
import DS from '@akashaproject/design-system';
import { ButtonValues, NavigateToParams } from '@akashaproject/ui-awf-typings';
import { useGetCount, useInfiniteLog, ILogItem } from '@akashaproject/ui-awf-hooks';

import Banner from './banner';
import DetailCard from './detail-card';
import MiniCardRenderer from './mini-card-renderer';

import { NoItemsFound } from '../error-cards';

const {
  styled,
  Box,
  Text,
  Icon,
  Spinner,
  TabsToolbar,
  StyledSwitchCardButton,
  useIntersectionObserver,
  BasicCardBox,
} = DS;

export interface ITransparencyLogProps {
  user: string | null;
  navigateTo: (args: NavigateToParams) => void;
}

const DEFAULT_LIMIT = 10;

const DetailCardWrapper = styled(BasicCardBox)<{
  isVisible: boolean;
}>`
  width: 63.5%;
  border-radius: 0.5rem;
  background: ${props => props.theme.colors.cardBackground};
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    width: 100%;
    ${props => {
      if (!props.isVisible) {
        return `
        display: none;
      `;
      }
    }}
  }
`;

const SidebarWrapper = styled(BasicCardBox)<{
  isVisible: boolean;
}>`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  border-radius: 0.5rem;
  background: ${props => props.theme.colors.cardBackground};
  ${props => {
    if (props.isVisible) {
      return `
        display: none;
      `;
    }
  }}
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    width: 35%;
    display: flex;
  }
`;

const ListWrapper = styled(Box)`
  flex: 1;
  margin-top: 0.5rem;
  flex-direction: row;
  justify-content: space-between;
`;

const StyledBox = styled(Box)`
  display: none;
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    display: flex;
  }
`;

const StyledIntroWrapper = styled(Box)`
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    border-radius: 0.5rem;
    padding: 0.75rem 0.75rem 0;
    border: 0.1rem solid ${props => props.theme.colors.border};
    background: ${props => props.theme.colors.cardBackground};
  }
`;

const VerticalFillBox = styled(Box)`
  height: calc(100vh - 48px /* topbar height */ - 2rem /* offset bottom */);
  /* add padding for mobile screens */
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    padding: 0 0.5rem;
  }
`;

const TransparencyLog: React.FC<ITransparencyLogProps> = props => {
  const { user, navigateTo } = props;

  const [activeButton, setActiveButton] = React.useState<string>(ButtonValues.ALL);
  const [selected, setSelected] = React.useState<ILogItem | null>(null);

  const { t } = useTranslation('app-moderation-ewa');

  const sdk = getSDK();
  const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;

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

  const onTabClick = (value: string) => () => {
    setActiveButton(value);
  };

  const handleClickArrowLeft = () => {
    setSelected(null);
  };

  const handleClickAvatar = (pubKey: string) => () => {
    if (pubKey)
      navigateTo?.({
        appName: '@akashaproject/app-profile',
        getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${pubKey}`,
      });
  };

  const handleCardClick = (el: ILogItem) => () => {
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

  return (
    <VerticalFillBox fill="vertical">
      <StyledIntroWrapper>
        <StyledBox fill="horizontal" margin={{ bottom: 'xlarge' }}>
          <Text size="xlarge" weight="bold" margin={{ bottom: 'xsmall' }}>
            {t('Moderating')}
          </Text>
          <Text color="secondaryText">
            {t('Find all the moderated posts, replies and accounts')}
          </Text>
        </StyledBox>
        <Box>
          <TabsToolbar
            noMarginBottom
            count={
              activeButton === ButtonValues.ALL
                ? count.kept + count.delisted
                : count[activeButton.toLowerCase()]
            }
            activeButton={activeButton}
            countLabel={
              activeButton === ButtonValues.ALL
                ? t('Moderated items')
                : t('{{activeButton}} items', { activeButton })
            }
            tabButtons={
              <>
                <StyledSwitchCardButton
                  label={buttonValues[0].label}
                  size="large"
                  removeBorder={false}
                  primary={ButtonValues.ALL === activeButton}
                  onClick={onTabClick(ButtonValues.ALL)}
                />
                <StyledSwitchCardButton
                  label={buttonValues[1].label}
                  size="large"
                  removeBorder={true}
                  primary={ButtonValues.KEPT === activeButton}
                  onClick={onTabClick(ButtonValues.KEPT)}
                />
                <StyledSwitchCardButton
                  label={buttonValues[2].label}
                  size="large"
                  removeBorder={true}
                  primary={ButtonValues.DELISTED === activeButton}
                  onClick={onTabClick(ButtonValues.DELISTED)}
                />
              </>
            }
            buttonValues={buttonValues}
            onTabClick={onTabClick}
            buttonsWrapperWidth={'40%'}
            loggedUser={user}
            hasMobileDesign={true} // adjusts to new design on mobile screens
            style={{ marginBottom: '-1px' }} // overlaps border with parent's bottom border
          />
        </Box>
      </StyledIntroWrapper>

      <ListWrapper>
        {/* setting height and overflow behaviour to make y-scrollable container */}
        <SidebarWrapper isVisible={!!selected}>
          {!logItemsQuery.isLoading && !logItemPages.length && (
            <NoItemsFound activeTab={'moderated'} />
          )}
          {!!logItemPages.length &&
            (activeButton === ButtonValues.STATS ? (
              <Banner count={count} />
            ) : activeButton === ButtonValues.KEPT && count.kept === 0 ? (
              <NoItemsFound activeTab={'kept'} />
            ) : activeButton === ButtonValues.DELISTED && count.delisted === 0 ? (
              <NoItemsFound activeTab={'delisted'} />
            ) : (
              // map through pages, for each page, filter results according to activeButton, then map through to render the mini card
              logItemPages.map((page, index) => (
                <Box key={index} flex={false}>
                  {
                    <MiniCardRenderer
                      results={page.results}
                      activeButton={activeButton}
                      selected={selected}
                      onCardClick={handleCardClick}
                    />
                  }
                </Box>
              ))
            ))}
          {/* fetch indicator for initial page load */}
          {logItemsQuery.isLoading && (
            <Box pad="large">
              <Spinner />
            </Box>
          )}
          {/* fetch indicator for load more on scroll, excluded on stats page */}
          {shouldLoadMore && (
            <Box pad="large" align="center">
              <Icon type="loading" accentColor={true} clickable={false} />
              <Text color="accentText">{t('Loading more ...')}</Text>
            </Box>
          )}
          {/* triggers intersection observer */}
          {hasLoadMoreRef && <Box pad="xxsmall" ref={loadmoreRef} />}
        </SidebarWrapper>
        <DetailCardWrapper isVisible={!!selected}>
          {selected && (
            <DetailCard
              selected={selected}
              ipfsGateway={ipfsGateway}
              handleClickAvatar={handleClickAvatar(selected.moderator?.pubKey)}
              handleClickArrowLeft={handleClickArrowLeft}
              navigateTo={navigateTo}
            />
          )}
          {!selected && <Banner count={count} />}
        </DetailCardWrapper>
      </ListWrapper>
    </VerticalFillBox>
  );
};

export default TransparencyLog;
