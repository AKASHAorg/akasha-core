import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { IModerationLogItemsCount } from '@akashaorg/typings/ui';

export interface IBanner {
  count: IModerationLogItemsCount;
}

const { TransparencyLogBanner } = DS;

const Banner: React.FC<IBanner> = props => {
  const { count } = props;

  const { t } = useTranslation('app-moderation-ewa');

  return (
    <TransparencyLogBanner
      size="12.75rem"
      assetName="moderation-history-illustration"
      title={t('Moderation history')}
      content={t(
        'Ethereum World moderating currently involves the delisting of posts, replies, and accounts in breach of the Code of Conduct. Anyone can view the history of moderating actions here. Personal information is not disclosed for reasons of personal privacy.',
      )}
      keptCount={count.kept}
      keptCountLabel={t('kept')}
      totalCountLabel={t('total')}
      delistedCount={count.delisted}
      delistedCountLabel={t('delisted')}
      footerLabel1={t('Check out the Ethereum World ')}
      footerLabel2={t(' here')}
      footerLinkLabel={t('Code of Conduct')}
      footerLink="https://akasha.ethereum.world/@akashaorg/app-legal/code-of-conduct"
    />
  );
};

export default Banner;
