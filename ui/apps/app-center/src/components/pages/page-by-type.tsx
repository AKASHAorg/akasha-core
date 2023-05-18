import React from 'react';
import Tab from '@akashaorg/design-system-core/lib/components/Tab';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { useTranslation } from 'react-i18next';
import { getTabIndexFromType } from './getTabIndexFromType';

export type AkashaVerseType = 'explore' | 'my-apps' | 'widgets';

export type PageByTypeProps = {
  type: AkashaVerseType;
};

const PageByType: React.FC<React.PropsWithChildren<PageByTypeProps>> = props => {
  const { type, children } = props;

  const [activeTab] = React.useState(getTabIndexFromType(type));
  const { t } = useTranslation('app-integration-center');

  return (
    <Card elevation="1" radius={20}>
      <Tab
        value={activeTab}
        onChange={() => {
          /*@TODO */
        }}
        labels={[t('Explore'), t('My Apps'), t('Widgets')]}
        bodyStyle="p-4"
        tabListDivider
      >
        {children}
      </Tab>
    </Card>
  );
};

export default PageByType;
