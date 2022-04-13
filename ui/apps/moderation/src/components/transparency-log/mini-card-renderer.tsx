import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { getMediaUrl, ILogItem } from '@akashaorg/ui-awf-hooks';
import { ButtonValues } from '@akashaorg/ui-awf-typings';

const { TransparencyLogMiniCard } = DS;

export interface IMiniCardRenderer {
  results: ILogItem[];
  activeButton: string;
  selected: ILogItem | null;
  onCardClick: (el: ILogItem) => () => void;
}

const MiniCardRenderer: React.FC<IMiniCardRenderer> = props => {
  const { results, activeButton, selected, onCardClick } = props;

  const { t } = useTranslation('app-moderation-ewa');

  const renderCard = (el: ILogItem, index: number) => (
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
      moderatorAvatarUrl={getMediaUrl(el.moderator.avatar)}
      moderatorEthAddress={el.moderator.ethAddress}
      onClickCard={onCardClick(el)}
    />
  );

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
