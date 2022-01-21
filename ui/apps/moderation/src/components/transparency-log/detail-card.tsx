import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import { ILogItem } from '@akashaproject/ui-awf-hooks';
import { ModerationItemTypes } from '@akashaproject/ui-awf-typings';

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

  const handleClickViewItem = (itemType: string, contentID: string) => () => {
    if (itemType === ModerationItemTypes.POST) {
      navigateToUrl(`${BASE_SOCIAL_URL}/post/${contentID}`);
    } else if (itemType === ModerationItemTypes.REPLY || itemType === ModerationItemTypes.COMMENT) {
      navigateToUrl(`${BASE_SOCIAL_URL}/reply/${contentID}`);
    } else if (itemType === ModerationItemTypes.ACCOUNT) {
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
      moderatorAvatarUrl={
        selected.moderator.avatar
          ? `${ipfsGateway}/${selected.moderator.avatar}`
          : selected.moderator.avatar
      }
      moderatorEthAddress={selected.moderator.ethAddress}
      reportedTimesLabel={t(
        `Reported ${selected.reports > 1 ? `${selected.reports} times` : 'once'}`,
      )}
      viewItemLink={`${window.location.origin}${
        selected.contentType === ModerationItemTypes.ACCOUNT
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
