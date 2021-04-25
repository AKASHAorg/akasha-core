import * as React from 'react';
import { Box, Text } from 'grommet';

import { ITag } from '../WidgetCard/trending-widget-card';
import { SubtitleTextIcon } from '../TextIcon';
import IconButton from '../IconButton';
import DuplexButton from '../DuplexButton';
import { IMentionData } from '../Charts/area-chart';
import { ResponsiveLineChart } from '../Charts';
import { Icon } from '../Icon';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';

export interface ITagDetailCard {
  tag: ITagData;
  mentionsLabel?: string;
  subscribeLabel?: string;
  subscribedLabel?: string;
  unsubscribeLabel?: string;
  popularityOverTimeLabel?: string;
  shareLabel?: string;
  handleSubscribe: (name: string) => void;
  handleUnsubscribe: (name: string) => void;
}

export interface ITagData extends ITag {
  tagHistoricData: IMentionData[];
  subscribed?: boolean;
}

const TagDetailCard: React.FC<ITagDetailCard> = props => {
  const {
    tag,
    mentionsLabel,
    subscribeLabel,
    unsubscribeLabel,
    subscribedLabel,
    popularityOverTimeLabel,
    shareLabel,
    handleSubscribe,
    handleUnsubscribe,
  } = props;

  const onSub = () => {
    handleSubscribe(tag.name);
  };

  const onUnsub = () => {
    handleUnsubscribe(tag.name);
  };

  const renderContent = () => {
    return (
      <Box direction="column" pad="medium">
        <Box direction="row" justify="between" pad={{ bottom: 'small' }}>
          <Text size="xsmall">{popularityOverTimeLabel}</Text>
          <IconButton
            secondary={true}
            icon={<Icon type="reply" color="white" />}
            label={shareLabel}
          />
        </Box>
        <Box height="11rem">
          <ResponsiveLineChart data={tag.tagHistoricData} />
        </Box>
        <Box direction="row" justify="between" pad={{ vertical: 'medium' }}>
          <SubtitleTextIcon
            label={tag.name}
            subtitle={`${tag.totalPosts} ${mentionsLabel}`}
            gap="xxsmall"
          />
          <DuplexButton
            fill="horizontal"
            label={subscribeLabel}
            icon={<Icon type="subscribe" />}
            onClickActive={onSub}
            onClickInactive={onUnsub}
            inactiveLabel={subscribeLabel}
            activeLabel={subscribedLabel}
            activeHoverLabel={unsubscribeLabel}
            active={tag.subscribed}
          />
        </Box>
      </Box>
    );
  };
  return <MainAreaCardBox>{renderContent()}</MainAreaCardBox>;
};

TagDetailCard.defaultProps = {
  mentionsLabel: 'mentions',
  subscribeLabel: 'Subscribe',
  subscribedLabel: 'Subscribed',
  unsubscribeLabel: 'Unsubscribe',
  popularityOverTimeLabel: 'Popularity over time',
  shareLabel: 'Share',
};

export { TagDetailCard };
