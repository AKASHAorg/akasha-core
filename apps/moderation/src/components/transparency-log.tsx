import React from 'react';
import { useTranslation } from 'react-i18next';
import getSDK from '@akashaproject/awf-sdk';
import DS from '@akashaproject/design-system';
import { moderationRequest } from '@akashaproject/ui-awf-hooks';

import { ICount } from './content-list';
import Banner from './transparency-log/banner';
import DetailCard, { ILogItem } from './transparency-log/detail-card';

const { Box, Text, Icon, Spinner, SwitchCard, TransparencyLogMiniCard } = DS;

export interface ITransparencyLogProps {
  user: string | null;
  logger: any;
  isMobile: boolean;
  navigateToUrl: (url: string) => void;
}

const DEFAULT_LIMIT = 10;

const TransparencyLog: React.FC<ITransparencyLogProps> = props => {
  const { user, logger, navigateToUrl, isMobile } = props;

  const [logItems, setLogItems] = React.useState<ILogItem[]>([]);
  const [nextIndex, setNextIndex] = React.useState<string | null>(null);
  const [requesting, setRequesting] = React.useState<boolean>(false);
  const [activeButton, setActiveButton] = React.useState<string>('All');
  const [count, setCount] = React.useState<ICount>({ kept: 0, pending: 0, delisted: 0 });
  const [selected, setSelected] = React.useState<ILogItem | null>(null);

  const { t } = useTranslation();
  const listItemObserver = React.useRef<any>();

  const sdk = getSDK();

  const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;

  React.useEffect(() => {
    fetchModerationLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const anchor = React.useCallback(
    node => {
      if (requesting) return;
      if (listItemObserver.current) listItemObserver.current.disconnect();
      listItemObserver.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && nextIndex) {
          // fetch more entries using nextIndex
          fetchModerationLog(nextIndex);
        }
      });
      if (node) listItemObserver.current.observe(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [requesting],
  );

  const getStatusCount = async () => {
    setRequesting(true);
    try {
      const response = await moderationRequest.getCount();
      if (response) {
        setCount(response);
      }
    } catch (error) {
      logger.error('[transparency-log.tsx]: getStatusCount err %j', error.message || '');
    } finally {
      setRequesting(false);
    }
  };

  const fetchModerationLog = async (offset?: string, limit?: number) => {
    // fetch log of moderated contents
    setRequesting(true);
    try {
      const response = await moderationRequest.getLog({
        offset,
        limit: limit || DEFAULT_LIMIT,
      });
      // check count only if fetching for the first time and offset is not yet defined
      if (offset === undefined) {
        getStatusCount();
      }
      if (response.results) {
        setLogItems([...logItems, ...response.results]);
      }
      setNextIndex(response.nextIndex);
    } catch (error) {
      logger.error('[transparency-log.tsx]: fetchModerationLog err %j', error.message || '');
    } finally {
      setRequesting(false);
    }
  };

  const onTabClick = (value: string) => {
    setActiveButton(buttonValues[buttonLabels.indexOf(value)]);
  };

  const handleClickArrowLeft = () => {
    setSelected(null);
  };

  const handleClickAvatar = () => {
    /* TODO */
  };

  const handleClickCard = (el: ILogItem) => () => {
    selected?.contentID === el.contentID ? setSelected(null) : setSelected(el);
  };

  const buttonValues = !isMobile
    ? ['All', 'Kept', 'Delisted']
    : ['All', 'Kept', 'Delisted', 'Stats'];
  const buttonLabels = !isMobile
    ? [t('All'), t('Kept'), t('Delisted')]
    : [t('All'), t('Kept'), t('Delisted'), t('Stats')];

  return (
    <Box>
      <SwitchCard
        count={
          activeButton === 'All' ? count.kept + count.delisted : count[activeButton.toLowerCase()]
        }
        activeButton={activeButton}
        countLabel={activeButton === 'All' ? t('Moderated items') : t(`${activeButton} items`)}
        buttonLabels={buttonLabels}
        buttonValues={buttonValues}
        onTabClick={onTabClick}
        buttonsWrapperWidth={'40%'}
        loggedUser={user}
        hasMobileDesign={true} // adjusts to new design on mobile screens
      />
      <Box direction="row" margin={{ top: '-0.5rem' }}>
        {/* setting height and overflow behaviour to make y-scrollable container */}
        <Box
          width={isMobile ? '100%' : '40%'}
          height={isMobile ? '100vh' : '80vh'}
          style={{ overflowY: 'scroll' }}
        >
          {!requesting && logItems.length < 1 && (
            <Text>{t('No moderated items found. Please check again later.')}</Text>
          )}
          {logItems.length > 0 &&
            (activeButton === 'Stats' ? (
              <Banner count={count} />
            ) : (
              logItems
                .filter(el =>
                  activeButton === 'Kept'
                    ? !el.delisted
                    : activeButton === 'Delisted'
                    ? el.delisted
                    : el,
                )
                .map((el, idx) => (
                  <TransparencyLogMiniCard
                    key={idx}
                    locale="en"
                    title={t(
                      `${el.contentType.charAt(0).toUpperCase()}${el.contentType.substring(1)} ${
                        el.delisted ? 'Delisted' : 'Kept'
                      }`,
                    )}
                    content={t(`${el.explanation}`)}
                    isSelected={el.contentID === selected?.contentID}
                    isDelisted={el.delisted}
                    moderatedTimestamp={el.moderatedDate.toString()}
                    moderatorAvatarUrl={`${ipfsGateway}/${el.moderator.avatar}`}
                    moderatorEthAddress={el.moderator.ethAddress}
                    onClickAvatar={handleClickAvatar}
                    onClickCard={handleClickCard(el)}
                  />
                ))
            ))}
          {/* fetch indicator for initial page load */}
          {requesting && logItems.length < 1 && (
            <Box pad="large">
              <Spinner />
            </Box>
          )}
          {/* fetch indicator for load more on scroll */}
          {requesting && logItems.length > 0 && (
            <Box pad="large" align="center">
              <Icon type="loading" accentColor={true} clickable={false} />
              <Text color="accentText">Loading more...</Text>
            </Box>
          )}
          {/* triggers intersection observer */}
          <Box pad="xxsmall" ref={anchor} />
        </Box>
        {isMobile && selected && (
          <Box width="100%" style={{ position: 'absolute', right: 0 }}>
            <DetailCard
              selected={selected}
              ipfsGateway={ipfsGateway}
              handleClickAvatar={handleClickAvatar}
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
                handleClickAvatar={handleClickAvatar}
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
