import React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { moderationRequest } from '@akashaproject/ui-awf-hooks';

import { ICount } from './content-list';

const {
  Box,
  Text,
  Icon,
  Spinner,
  SwitchCard,
  TransparencyLogBanner,
  TransparencyLogMiniCard,
  TransparencyLogDetailCard,
} = DS;

export interface ITransparencyLogProps {
  ethAddress: string | null;
  logger: any;
  isMobile: boolean;
  navigateToUrl: (url: string) => void;
}

interface ILogItem {
  contentID: string;
  contentType: string;
  moderatedDate: Date;
  moderator: {
    ethAddress: string;
    name: string;
    userName: string;
    avatar: string;
  };
  delisted: false;
  reasons: string[];
  reports: number;
  explanation: string;
}

const BASE_SOCIAL_URL = '/social-app';
const BASE_PROFILE_URL = '/profile';
const DEFAULT_LIMIT = 10;

const TransparencyLog: React.FC<ITransparencyLogProps> = props => {
  const { ethAddress, logger, navigateToUrl, isMobile } = props;

  const [logItems, setLogItems] = React.useState<ILogItem[]>([]);
  const [nextIndex, setNextIndex] = React.useState<string | null>(null);
  const [requesting, setRequesting] = React.useState<boolean>(false);
  const [activeButton, setActiveButton] = React.useState<string>('All');
  const [count, setCount] = React.useState<ICount>({ kept: 0, pending: 0, delisted: 0 });
  const [selected, setSelected] = React.useState<ILogItem | null>(null);

  const { t } = useTranslation();
  const listItemObserver = React.useRef<any>();

  React.useEffect(() => {
    fetchModerationLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const anchor = React.useCallback(
    node => {
      if (requesting) return;
      if (listItemObserver.current) listItemObserver.current.disconnect();
      listItemObserver.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && nextIndex !== null) {
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
      getStatusCount();
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

  const handleClickViewItem = (contentType: string, contentID: string) => () => {
    if (contentType === 'post') {
      navigateToUrl(`${BASE_SOCIAL_URL}/post/${contentID}`);
    } else if (contentType === 'reply' || contentType === 'comment') {
      navigateToUrl(`${BASE_SOCIAL_URL}/reply/${contentID}`);
    } else if (contentType === 'account') {
      navigateToUrl(`${BASE_PROFILE_URL}/${contentID}`);
    }
  };

  const handleClickAvatar = () => {
    /* TODO */
  };

  const handleClickContactModerators = () => {
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

  const baseAvatarUrl = 'https://hub.textile.io/ipfs/';

  const RenderDetailCard = (selected: ILogItem) => {
    return (
      <TransparencyLogDetailCard
        locale="en"
        title={t(
          `${selected.contentType.charAt(0).toUpperCase()}${selected.contentType.substring(1)} ${
            selected.delisted ? 'delisted by' : 'kept by'
          }`,
        )}
        content={t(`${selected.explanation}`)}
        isDelisted={selected.delisted}
        moderator={selected.moderator.name}
        moderatedTimestamp={selected.moderatedDate.toString()}
        moderatorAvatarUrl={
          baseAvatarUrl + selected.moderator.avatar || 'https://placebeard.it/360x360'
        }
        moderatorEthAddress={selected.moderator.ethAddress}
        reportedTimesLabel={t(
          `Reported ${selected.reports > 1 ? `${selected.reports} times` : 'once'}`,
        )}
        viewItemLabel={t(`View ${selected.contentType}`)}
        reasonsLabel={t(`${selected.reasons.length > 1 ? 'reasons' : 'reason'}`)}
        reasons={selected.reasons}
        explanationLabel={t('explanation')}
        contactModeratorsLabel={t('Contact the moderators')}
        onClickArrowLeft={handleClickArrowLeft}
        onClickViewItem={handleClickViewItem(selected.contentType, selected.contentID)}
        onClickAvatar={handleClickAvatar}
        onClickContactModerators={handleClickContactModerators}
      />
    );
  };

  const RenderBanner = () => {
    return (
      <TransparencyLogBanner
        size="12.75rem"
        assetName="moderation-history-illustration"
        title={t('Moderation History')}
        content={t(
          'Here you will find the moderated posts, replies, and accounts of Ethereum World. We do not reveal any personal information of the author or submitter(s) to protect their privacy.',
        )}
        keptCount={count.kept}
        keptCountLabel={t('kept')}
        totalCountLabel={t('total')}
        delistedCount={count.delisted}
        delistedCountLabel={t('delisted')}
        footerLabel={t('Visit our Code of Conduct to learn more about our moderation criteria')}
        footerLinkLabel={t('Code of Conduct')}
        footerLink="https://akasha.ethereum.world/legal/code-of-conduct"
      />
    );
  };

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
        loggedEthAddress={ethAddress}
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
            (activeButton === 'Stats'
              ? RenderBanner()
              : logItems
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
                      moderatorAvatarUrl={
                        baseAvatarUrl + el.moderator.avatar || 'https://placebeard.it/360x360'
                      }
                      moderatorEthAddress={el.moderator.ethAddress}
                      onClickAvatar={handleClickAvatar}
                      onClickCard={handleClickCard(el)}
                    />
                  )))}
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
            {RenderDetailCard(selected)}
          </Box>
        )}
        {!isMobile && (
          <Box width="60%">{selected ? RenderDetailCard(selected) : RenderBanner()}</Box>
        )}
      </Box>
    </Box>
  );
};

export default TransparencyLog;
