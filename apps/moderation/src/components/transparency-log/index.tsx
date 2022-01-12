import React from 'react';
import { useTranslation } from 'react-i18next';

import getSDK from '@akashaproject/awf-sdk';
import DS from '@akashaproject/design-system';
import { ButtonValues } from '@akashaproject/ui-awf-typings';
import { useGetCount, useInfiniteLog, ILogItem } from '@akashaproject/ui-awf-hooks';

import Banner from './banner';
import DetailCard from './detail-card';
import { NoItemsFound } from '../error-cards';

const {
  styled,
  Box,
  Text,
  Icon,
  Spinner,
  TabsToolbar,
  StyledSwitchCardButton,
  TransparencyLogMiniCard,
  useIntersectionObserver,
  BasicCardBox,
} = DS;

export interface ITransparencyLogProps {
  user: string | null;
  navigateToUrl: (url: string) => void;
}

const DEFAULT_LIMIT = 10;

const DetailCardWrapper = styled(Box)`
  width: 100%;
`;

const SidebarWrapper: React.FC<{ isSelected: boolean }> = styled(Box)<{ isSelected: boolean }>`
  min-width: 100%;
  height: 100%;
  flex: 1;
  overflow-y: scroll;
  ${props => {
    if (props.isSelected) {
      return `
        display: none;
      `;
    }
  }}
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    min-width: 40%;
    display: flex;
  }

  @media only screen and (min-width: ${props => props.theme.breakpoints.large.value}px) {
    min-width: 33%;
    display: flex;
  }
`;

const ListWrapper = styled(BasicCardBox)`
  flex-direction: row;
  flex: 1;
`;

const VerticalFillBox = styled(Box)`
  height: calc(100vh - 48px /* topbar height */ - 2rem /* offset bottom */);
`;

const TransparencyLog: React.FC<ITransparencyLogProps> = props => {
  const { user, navigateToUrl } = props;

  const [activeButton, setActiveButton] = React.useState<string>(ButtonValues.ALL);
  const [selected, setSelected] = React.useState<ILogItem | null>(null);

  const { t } = useTranslation();

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
    if (pubKey) navigateToUrl(`/profile/${pubKey}`);
  };

  const handleClickCard = (el: ILogItem) => () => {
    selected?.contentID === el.contentID ? setSelected(null) : setSelected(el);
  };

  const buttonValues = [
    ButtonValues.ALL,
    ButtonValues.KEPT,
    ButtonValues.DELISTED,
    ButtonValues.STATS,
  ];
  const buttonLabels = buttonValues.map(value => t(value));

  return (
    <VerticalFillBox fill="vertical">
      <TabsToolbar
        noMarginBottom
        count={
          activeButton === ButtonValues.ALL
            ? count.kept + count.delisted
            : count[activeButton.toLowerCase()]
        }
        activeButton={activeButton}
        countLabel={
          activeButton === ButtonValues.ALL ? t('Moderated items') : t(`${activeButton} items`)
        }
        tabButtons={
          <>
            <StyledSwitchCardButton
              label={t(ButtonValues.ALL)}
              size="large"
              removeBorder={false}
              primary={ButtonValues.ALL === activeButton}
              onClick={onTabClick(ButtonValues.ALL)}
            />
            <StyledSwitchCardButton
              label={t(ButtonValues.KEPT)}
              size="large"
              removeBorder={true}
              primary={ButtonValues.KEPT === activeButton}
              onClick={onTabClick(ButtonValues.KEPT)}
            />
            <StyledSwitchCardButton
              label={t(ButtonValues.DELISTED)}
              size="large"
              removeBorder={true}
              primary={ButtonValues.DELISTED === activeButton}
              onClick={onTabClick(ButtonValues.DELISTED)}
            />
          </>
        }
        buttonLabels={buttonLabels}
        buttonValues={buttonValues}
        onTabClick={onTabClick}
        buttonsWrapperWidth={'40%'}
        loggedUser={user}
        hasMobileDesign={true} // adjusts to new design on mobile screens
      />
      <ListWrapper>
        {/* setting height and overflow behaviour to make y-scrollable container */}
        <SidebarWrapper isSelected={!!selected}>
          {!logItemsQuery.isLoading && !logItemPages.length && (
            <NoItemsFound activeTab={'moderated'} />
          )}
          {!!logItemPages.length &&
            (activeButton === ButtonValues.STATS ? (
              <Banner count={count} />
            ) : (
              // map through pages, for each page, filter results according to activeButton, then map through to render the mini card
              logItemPages.map((page, index) => (
                <Box key={index} flex={false}>
                  {page.results
                    .filter((el: { delisted: boolean }) =>
                      activeButton === ButtonValues.KEPT
                        ? !el.delisted
                        : activeButton === ButtonValues.DELISTED
                        ? el.delisted
                        : el,
                    )
                    .map((el: ILogItem, index: number) => (
                      <TransparencyLogMiniCard
                        key={index}
                        locale="en"
                        title={t(
                          `${el.contentType.charAt(0).toUpperCase()}${el.contentType.substring(
                            1,
                          )} ${el.delisted ? ButtonValues.DELISTED : ButtonValues.KEPT}`,
                        )}
                        content={t(`${el.explanation}`)}
                        isSelected={el.contentID === selected?.contentID}
                        isDelisted={el.delisted}
                        moderator={el.moderator.name}
                        moderatedTimestamp={el.moderatedDate.toString()}
                        moderatorAvatarUrl={
                          el.moderator.avatar
                            ? `${ipfsGateway}/${el.moderator.avatar}`
                            : el.moderator.avatar
                        }
                        moderatorEthAddress={el.moderator.ethAddress}
                        onClickCard={handleClickCard(el)}
                      />
                    ))}
                </Box>
              ))
            ))}
          {/* fetch indicator for initial page load */}
          {logItemsQuery.isLoading && (
            <Box pad="large">
              <Spinner />
            </Box>
          )}
          {/* fetch indicator for load more on scroll */}
          {logItemsQuery.isFetching && logItemPages.length > 0 && (
            <Box pad="large" align="center">
              <Icon type="loading" accentColor={true} clickable={false} />
              <Text color="accentText">{t('Loading more ...')}</Text>
            </Box>
          )}
          {/* triggers intersection observer */}
          <Box pad="xxsmall" ref={loadmoreRef} />
        </SidebarWrapper>
        <DetailCardWrapper>
          {selected && (
            <DetailCard
              selected={selected}
              ipfsGateway={ipfsGateway}
              handleClickAvatar={handleClickAvatar(selected.moderator?.pubKey)}
              handleClickArrowLeft={handleClickArrowLeft}
              navigateToUrl={navigateToUrl}
            />
          )}
          {!selected && <Banner count={count} />}
        </DetailCardWrapper>
      </ListWrapper>
    </VerticalFillBox>
  );
};

export default TransparencyLog;
