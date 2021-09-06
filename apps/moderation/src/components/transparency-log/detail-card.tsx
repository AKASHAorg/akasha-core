import React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';

export interface ILogItem {
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

export interface IDetailCard {
  selected: ILogItem;
  ipfsGateway: string;
  handleClickAvatar: () => void;
  handleClickArrowLeft: () => void;
  navigateToUrl: (url: string) => void;
}

export const BASE_SOCIAL_URL = '/social-app';
export const BASE_PROFILE_URL = '/profile';

const { TransparencyLogDetailCard } = DS;

const DetailCard: React.FC<IDetailCard> = props => {
  const { selected, ipfsGateway, handleClickAvatar, handleClickArrowLeft, navigateToUrl } = props;

  const { t } = useTranslation();

  const handleClickViewItem = (contentType: string, contentID: string) => () => {
    if (contentType === 'post') {
      navigateToUrl(`${BASE_SOCIAL_URL}/post/${contentID}`);
    } else if (contentType === 'reply' || contentType === 'comment') {
      navigateToUrl(`${BASE_SOCIAL_URL}/reply/${contentID}`);
    } else if (contentType === 'account') {
      navigateToUrl(`${BASE_PROFILE_URL}/${contentID}`);
    }
  };

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
      moderatorAvatarUrl={`${ipfsGateway}/${selected.moderator.avatar}`}
      moderatorEthAddress={selected.moderator.ethAddress}
      reportedTimesLabel={t(
        `Reported ${selected.reports > 1 ? `${selected.reports} times` : 'once'}`,
      )}
      viewItemLink={`${window.location.origin}${
        selected.contentType === 'account'
          ? `${BASE_PROFILE_URL}/${selected.contentID}`
          : `${BASE_SOCIAL_URL}/${selected.contentType}/${selected.contentID}`
      }`}
      viewItemLabel={t(`View ${selected.contentType}`)}
      reasonsLabel={t(`${selected.reasons.length > 1 ? 'reasons' : 'reason'}`)}
      reasons={selected.reasons}
      explanationLabel={t('explanation')}
      contactModeratorsLabel={t('Contact the moderators')}
      contactModeratorsLink="mailto:moderators@ethereum.world"
      onClickArrowLeft={handleClickArrowLeft}
      onClickViewItem={handleClickViewItem(selected.contentType, selected.contentID)}
      onClickAvatar={handleClickAvatar}
    />
  );
};

export default DetailCard;
