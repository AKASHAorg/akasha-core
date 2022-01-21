import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import { ICount } from '@akashaproject/ui-awf-hooks';

export interface IBanner {
  count: ICount;
}

const { TransparencyLogBanner } = DS;

const Banner: React.FC<IBanner> = props => {
  const { count } = props;

  const { t } = useTranslation();

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

export default Banner;
