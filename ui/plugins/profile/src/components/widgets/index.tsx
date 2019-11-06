import * as React from 'react';
import { AppsWidgetCard, styled, TopicsWidgetCard } from '@akashaproject/design-system';
import { IAppsData } from '@akashaproject/design-system/lib/components/Cards/apps-widget-card';
import { useTranslation } from 'react-i18next';

const appsDataSource: IAppsData[] = [
  { title: 'GitCoin', subtitle: '123 embedded cards', appIconType: 'app', iconSize: '40px' },
  { title: 'Augur', subtitle: '89 embedded cards', appIconType: 'app', iconSize: '40px' },
  { title: 'Aragon', subtitle: '57 embedded cards', appIconType: 'app', iconSize: '40px' },
];
const topicsDataSource = [
  { title: '#ethereumworld', subtitle: '6576 mentions' },
  { title: '#akashaworld', subtitle: '3204 mentions' },
  { title: '#cryptoworld', subtitle: '6576 mentions' },
];

// interface IWidgetListProps {}
const AppsWidget = styled.div`
  padding: 0 1em;
  margin-top: 0.5em;
`;

const TopicsWidget = styled.div`
  padding: 0 1em;
`;

const WidgetList = (/* props: IWidgetListProps */) => {
  const [t] = useTranslation();
  const handleAppClick = (ev: any) => {
    console.log('app clicked', ev);
  };
  const handleTopicsClick = (ev: any) => {
    console.log('topics clicked', ev);
  };
  return (
    <>
      <TopicsWidget>
        <TopicsWidgetCard
          onClick={handleTopicsClick}
          label={t('Hot Topics')}
          iconType="hotTopics"
          dataSource={topicsDataSource}
        />
      </TopicsWidget>
      <AppsWidget>
        <AppsWidgetCard
          dataSource={appsDataSource}
          label={t('Trending Apps')}
          onClick={handleAppClick}
          iconType="app"
        />
      </AppsWidget>
    </>
  );
};

export default WidgetList;
