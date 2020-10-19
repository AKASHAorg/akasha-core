import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { ITopicData } from '@akashaproject/design-system/lib/components/Cards/widget-cards/topics-widget-card';

const { Box, TopicsWidgetCard } = DS;

const topicsDataSource = [
  { title: '#ethereumworld', subtitle: '6576 mentions' },
  { title: '#akashaworld', subtitle: '3204 mentions' },
  { title: '#cryptoworld', subtitle: '6576 mentions' },
];

const TopicsCardWidget: React.FC<{}> = () => {
  const { t } = useTranslation();
  const handleTopicsTitleClick = () => {
    console.log('topics title clicked');
  };
  const handleTopicClick = (topic: ITopicData) => {
    console.log('topic:', topic, 'was clicked');
  };
  return (
    <Box margin={{ bottom: '0.5em' }}>
      <TopicsWidgetCard
        onClick={handleTopicsTitleClick}
        label={t('Hot Topics')}
        iconType="hotTopics"
        dataSource={topicsDataSource}
        onTopicClick={handleTopicClick}
      />
    </Box>
  );
};

export default TopicsCardWidget;
