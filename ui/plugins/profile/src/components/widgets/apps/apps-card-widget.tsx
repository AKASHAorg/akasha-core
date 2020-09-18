import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { IAppData } from '@akashaproject/design-system/lib/components/Cards/widget-cards/apps-widget-card';

const { styled, AppsWidgetCard } = DS;

const Wrapper = styled.div`
  margin-bottom: 0.5em;
`;

const appsDataSource: IAppData[] = [
  { title: 'GitCoin', subtitle: '123 embedded cards', appIconType: 'app', iconSize: '40px' },
  { title: 'Augur', subtitle: '89 embedded cards', appIconType: 'app', iconSize: '40px' },
  { title: 'Aragon', subtitle: '57 embedded cards', appIconType: 'app', iconSize: '40px' },
];

const AppsCardWidget: React.FC<{}> = () => {
  const { t } = useTranslation();
  const handleAppTitleClick = () => {
    console.log('app title clicked');
  };
  const handleAppClick = (app: IAppData) => {
    console.log('app:', app, 'was clicked');
  };

  return (
    <Wrapper>
      <AppsWidgetCard
        dataSource={appsDataSource}
        label={t('Trending Apps')}
        onClick={handleAppTitleClick}
        iconType="app"
        onAppClick={handleAppClick}
      />
    </Wrapper>
  );
};

export default AppsCardWidget;
