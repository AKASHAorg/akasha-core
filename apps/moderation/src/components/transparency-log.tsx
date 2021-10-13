import React from 'react';
import { useTranslation } from 'react-i18next';

import getSDK from '@akashaproject/awf-sdk';
import DS from '@akashaproject/design-system';
import { ButtonValues } from '@akashaproject/ui-awf-typings';
import { ILogItem } from '@akashaproject/ui-awf-hooks/lib/moderation-requests';
import { useGetCount, useInfiniteLog } from '@akashaproject/ui-awf-hooks/lib/use-moderation';

import Banner from './transparency-log/banner';
import DetailCard from './transparency-log/detail-card';

const { Box, Text, Icon, Spinner, SwitchCard, TransparencyLogMiniCard, useIntersectionObserver } =
  DS;

export interface ITransparencyLogProps {
  user: string | null;
  isMobile: boolean;
  navigateToUrl: (url: string) => void;
}

const DEFAULT_LIMIT = 10;

const TransparencyLog: React.FC<ITransparencyLogProps> = props => {
  const { user, navigateToUrl, isMobile } = props;

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

  const onTabClick = (value: string) => {
    setActiveButton(buttonValues[buttonLabels.indexOf(value)]);
  };

  const handleClickArrowLeft = () => {
    setSelected(null);
  };

  const handleClickAvatar = (pubKey: string) => () => {
    navigateToUrl(`/profile/${pubKey}`);
  };

  const handleClickCard = (el: ILogItem) => () => {
    selected?.contentID === el.contentID ? setSelected(null) : setSelected(el);
  };

  const buttonValues = !isMobile
    ? [ButtonValues.ALL, ButtonValues.KEPT, ButtonValues.DELISTED]
    : [ButtonValues.ALL, ButtonValues.KEPT, ButtonValues.DELISTED, ButtonValues.STATS];

  const buttonLabels = buttonValues.map(value => t(value));

  return (
    <Box>
      {!selected && (
        <SwitchCard
          count={
            activeButton === ButtonValues.ALL
              ? count.kept + count.delisted
              : count[activeButton.toLowerCase()]
          }
          activeButton={activeButton}
          countLabel={
            activeButton === ButtonValues.ALL ? t('Moderated items') : t(`${activeButton} items`)
          }
          buttonLabels={buttonLabels}
          buttonValues={buttonValues}
          onTabClick={onTabClick}
          buttonsWrapperWidth={'40%'}
          loggedUser={user}
          hasMobileDesign={true} // adjusts to new design on mobile screens
        />
      )}
      <Box direction="row" margin={{ top: '-0.5rem' }}>
        {/* setting height and overflow behaviour to make y-scrollable container */}
        <Box
          width={isMobile ? '100%' : '40%'}
          height={isMobile ? '100vh' : 'calc(100vh - 8.5rem)'}
          style={{ overflowY: 'scroll' }}
        >
          {!logItemsQuery.isLoading && !logItemPages.length && (
            <Text>{t('No moderated items found. Please check again later.')}</Text>
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
          {logItemsQuery.isLoading && logItemPages.length < 1 && (
            <Box pad="large">
              <Spinner />
            </Box>
          )}
          {/* fetch indicator for load more on scroll */}
          {logItemsQuery.isLoading && logItemPages.length > 0 && (
            <Box pad="large" align="center">
              <Icon type="loading" accentColor={true} clickable={false} />
              <Text color="accentText">{t('Loading more ...')}</Text>
            </Box>
          )}
          {/* triggers intersection observer */}
          <Box pad="xxsmall" ref={loadmoreRef} />
        </Box>
        {isMobile && selected && (
          <Box width="100%" style={{ position: 'absolute', right: 0 }}>
            <DetailCard
              selected={selected}
              ipfsGateway={ipfsGateway}
              handleClickAvatar={handleClickAvatar(selected.moderator.pubKey)}
              handleClickArrowLeft={handleClickArrowLeft}
              navigateToUrl={navigateToUrl}
            />
          </Box>
        )}
        {!isMobile && (
          <Box width="60%">
            {selected && (
              <DetailCard
                selected={selected}
                ipfsGateway={ipfsGateway}
                handleClickAvatar={handleClickAvatar(selected.moderator.pubKey)}
                handleClickArrowLeft={handleClickArrowLeft}
                navigateToUrl={navigateToUrl}
              />
            )}
            {!selected && <Banner count={count} />}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TransparencyLog;
