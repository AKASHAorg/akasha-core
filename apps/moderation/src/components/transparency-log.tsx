import React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { moderationRequest } from '@akashaproject/ui-awf-hooks';

import { ICount } from './content-list';

const {
  Box,
  Text,
  Spinner,
  SwitchCard,
  TransparencyLogBanner,
  TransparencyLogMiniCard,
  TransparencyLogDetailCard,
} = DS;

export interface ITransparencyLogProps {
  ethAddress: string | null;
  logger: any;
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
  explanation: string;
}

const TransparencyLog: React.FC<ITransparencyLogProps> = props => {
  const { ethAddress, logger } = props;

  const [logItems, setLogItems] = React.useState<ILogItem[]>([]);
  const [requesting, setRequesting] = React.useState<boolean>(false);
  const [activeButton, setActiveButton] = React.useState<string>('All');
  const [count, setCount] = React.useState<ICount>({ kept: 0, pending: 0, delisted: 0 });
  const [selected, setSelected] = React.useState<ILogItem | null>(null);

  const { t } = useTranslation();

  React.useEffect(() => {
    fetchModerationLog();
  }, []);

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

  const fetchModerationLog = async () => {
    // fetch log of moderated contents
    setRequesting(true);
    try {
      const response = await moderationRequest.getLog();
      if (response.results) {
        setLogItems(response.results);
      }
      getStatusCount();
    } catch (error) {
      logger.error('[transparency-log.tsx]: fetchModerationLog err %j', error.message || '');
    } finally {
      setRequesting(false);
    }
  };

  const onTabClick = (value: string) => {
    setActiveButton(buttonValues[buttonLabels.indexOf(value)]);
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

  const buttonValues = ['All', 'Kept', 'Delisted'];
  const buttonLabels = [t('All'), t('Kept'), t('Delisted')];

  const baseAvatarUrl = 'https://hub.textile.io/ipfs/';

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
      />
      <Box direction="row">
        <Box width="40%">
          {requesting && (
            <Box pad="large">
              <Spinner />
            </Box>
          )}
          {!requesting && logItems.length < 1 && (
            <Text>{t('No moderated items found. Please check again later.')}</Text>
          )}
          {!requesting &&
            logItems.length > 0 &&
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
                  moderatorAvatarUrl={
                    baseAvatarUrl + el.moderator.avatar || 'https://placebeard.it/360x360'
                  }
                  moderatorEthAddress={el.moderator.ethAddress}
                  onClickAvatar={handleClickAvatar}
                  onClickCard={handleClickCard(el)}
                />
              ))}
        </Box>
        <Box width="60%">
          {selected ? (
            <TransparencyLogDetailCard
              locale="en"
              title={t(
                `${selected.contentType.charAt(0).toUpperCase()}${selected.contentType.substring(
                  1,
                )} ${selected.delisted ? 'delisted by' : 'kept by'}`,
              )}
              content={t(`${selected.explanation}`)}
              isDelisted={selected.delisted}
              moderator={selected.moderator.name}
              moderatedTimestamp={selected.moderatedDate.toString()}
              moderatorAvatarUrl={
                baseAvatarUrl + selected.moderator.avatar || 'https://placebeard.it/360x360'
              }
              moderatorEthAddress={selected.moderator.ethAddress}
              reportedTimesLabel={t(`Reported ${4} times`)}
              reasonsLabel={t(`${selected.reasons.length > 1 ? 'reasons' : 'reason'}`)}
              reasons={selected.reasons}
              explanationLabel={t('explanation')}
              contactModeratorsLabel={t('Contact the moderators')}
              onClickAvatar={handleClickAvatar}
              onClickContactModerators={handleClickContactModerators}
            />
          ) : (
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
              footerLabel={t(
                'Visit our Code of Conduct to learn more about our moderation criteria',
              )}
              footerLinkLabel={t('Code of Conduct')}
              footerLink="https://akasha.ethereum.world/legal/code-of-conduct"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TransparencyLog;
