import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import { getMediaUrl, ILogItem } from '@akashaproject/ui-awf-hooks';
import { ModerationItemTypes, NavigateToParams } from '@akashaproject/ui-awf-typings';

export interface IDetailCard {
  selected: ILogItem;
  handleClickAvatar: () => void;
  handleClickArrowLeft: () => void;
  navigateTo: (args: NavigateToParams) => void;
}

export const BASE_SOCIAL_URL = '/social-app';
export const BASE_PROFILE_URL = '/profile';

const { TransparencyLogDetailCard } = DS;

const DetailCard: React.FC<IDetailCard> = props => {

  const { selected, handleClickAvatar, handleClickArrowLeft, navigateTo } = props;

  const { t } = useTranslation('app-moderation-ewa');

  const handleClickViewItem = (itemType: string, contentID: string) => () => {
    if (itemType === ModerationItemTypes.POST) {
      navigateTo?.({
        appName: '@akashaproject/app-akasha-integration',
        getNavigationUrl: navRoutes => `${navRoutes.Post}/${contentID}`,
      });
    } else if (itemType === ModerationItemTypes.REPLY || itemType === ModerationItemTypes.COMMENT) {
      navigateTo?.({
        appName: '@akashaproject/app-akasha-integration',
        getNavigationUrl: navRoutes => `${navRoutes.Reply}/${contentID}`,
      });
    } else if (itemType === ModerationItemTypes.ACCOUNT) {
      navigateTo?.({
        appName: '@akashaproject/app-profile',
        getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${contentID}`,
      });
    }
  };

  return (
    <TransparencyLogDetailCard
      locale="en"
      title={t('{{ selectedContentType }} {{ selectedDelisted }}', {
        selectedContentType: selected.contentType,
        selectedDelisted: selected.delisted ? 'delisted by' : 'kept by',
      })}
      content={t('{{explanation}}', { explanation: selected.explanation })}
      isDelisted={selected.delisted}
      moderator={selected.moderator.name}
      moderatedTimestamp={selected.moderatedDate.toString()}
      moderatorAvatarUrl={getMediaUrl(selected.moderator.avatar)}
      moderatorEthAddress={selected.moderator.ethAddress}
      reportedTimesLabel={t('Reported {{ reportedTimes }}', {
        reportedTimes: selected.reports > 1 ? `${selected.reports} times` : 'once',
      })}
      viewItemLink={`${window.location.origin}${
        selected.contentType === ModerationItemTypes.ACCOUNT
          ? `${BASE_PROFILE_URL}/${selected.contentID}`
          : `${BASE_SOCIAL_URL}/${selected.contentType}/${selected.contentID}`
      }`}
      viewItemLabel={t('View {{contentType}}', { contentType: selected.contentType })}
      reasonsLabel={t('{{reasons}}', {
        reasons: selected.reasons.length > 1 ? 'reasons' : 'reason',
      })}
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
