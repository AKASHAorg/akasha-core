import DS from '@akashaproject/design-system';
import { IAppData } from '@akashaproject/design-system/lib/components/Cards/apps-widget-card';
import { ITopicData } from '@akashaproject/design-system/lib/components/Cards/topics-widget-card';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

const { AppsWidgetCard, styled, TopicsWidgetCard } = DS;

const appsDataSource: IAppData[] = [
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
  margin-top: 0.5em;
`;

const TopicsWidget = styled.div``;

const WidgetList = (/* props: IWidgetListProps */) => {
  const { t } = useTranslation();
  const handleAppTitleClick = () => {
    // tslint:disable-next-line no-console
    console.log('app title clicked');
  };
  const handleTopicsTitleClick = () => {
    // tslint:disable-next-line no-console
    console.log('topics title clicked');
  };
  const handleTopicClick = (topic: ITopicData) => {
    // tslint:disable-next-line no-console
    console.log('topic:', topic, 'was clicked');
  };
  const handleAppClick = (app: IAppData) => {
    // tslint:disable-next-line no-console
    console.log('app:', app, 'was clicked');
  };
  return (
    <>
      <TopicsWidget>
        <TopicsWidgetCard
          onClick={handleTopicsTitleClick}
          label={t('Hot Topics')}
          iconType="hotTopics"
          dataSource={topicsDataSource}
          onTopicClick={handleTopicClick}
        />
      </TopicsWidget>
      <AppsWidget>
        <AppsWidgetCard
          dataSource={appsDataSource}
          label={t('Trending Apps')}
          onClick={handleAppTitleClick}
          iconType="app"
          onAppClick={handleAppClick}
        />
      </AppsWidget>
    </>
  );
};

export default WidgetList;
