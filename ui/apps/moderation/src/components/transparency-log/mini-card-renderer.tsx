import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { getMediaUrl } from '@akashaorg/ui-awf-hooks';
import { ButtonValues, IModerationLogItem } from '@akashaorg/typings/ui';

const { TransparencyLogMiniCard } = DS;

export interface IMiniCardRenderer {
  results: IModerationLogItem[];
  activeButton: string;
  selected: IModerationLogItem | null;
  onCardClick: (el: IModerationLogItem) => () => void;
}

const MiniCardRenderer: React.FC<IMiniCardRenderer> = props => {
  const { results, activeButton, selected, onCardClick } = props;

  const { t } = useTranslation('app-moderation-ewa');

  const renderCard = (el: IModerationLogItem, index: number) => {
    const avatarIpfsLinks = getMediaUrl(el.moderator.avatar);
    return (
      <TransparencyLogMiniCard
        key={index}
        locale="en"
        title={t('{{ elContentType }} {{ elContentStatus }}', {
          elContentType: el.contentType,
          elContentStatus: el.delisted ? ButtonValues.DELISTED : ButtonValues.KEPT,
        })}
        content={t('{{elExplanation}}', { elExplanation: el.explanation })}
        isSelected={el.contentID === selected?.contentID}
        isDelisted={el.delisted}
        moderator={el.moderator.name}
        moderatedTimestamp={el.moderatedDate.toString()}
        moderatorAvatar={{
          url: avatarIpfsLinks?.originLink,
          fallbackUrl: avatarIpfsLinks?.fallbackLink,
        }}
        moderatorEthAddress={el.moderator.ethAddress}
        onClickCard={onCardClick(el)}
      />
    );
  };

  return (
    <>
      {activeButton === ButtonValues.ALL && results.map(renderCard)}
      {activeButton === ButtonValues.KEPT &&
        results.filter((el: { delisted: boolean }) => !el.delisted).map(renderCard)}
      {activeButton === ButtonValues.DELISTED &&
        results.filter((el: { delisted: boolean }) => el.delisted).map(renderCard)}
    </>
  );
};

export default MiniCardRenderer;
