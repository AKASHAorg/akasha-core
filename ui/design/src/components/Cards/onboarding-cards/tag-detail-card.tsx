import * as React from 'react';
import { ITag } from '../widget-cards/trending-widget-card';
import { SubtitleTextIcon } from '../../TextIcon';
import { Box, Text } from 'grommet';
import { DuplexButton, IconButton } from '../../Buttons';
import { IMentionData } from '../../Charts/area-chart';
import { ResponsiveLineChart } from '../../Charts';
import { Icon } from '../../Icon';
import { MainAreaCardBox } from '../common/basic-card-box';

export interface ITagDetailCard {
  tag: ITagData;
  mentionsLabel?: string;
  subscribeLabel?: string;
  subscribedLabel?: string;
  unsubscribeLabel?: string;
  popularityOverTimeLabel?: string;
  shareLabel?: string;
  handleSubscribe: (tagName: string) => void;
  handleUnsubscribe: (tagName: string) => void;
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
    handleSubscribe(tag.tagName);
  };

  const onUnsub = () => {
    handleUnsubscribe(tag.tagName);
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
            label={tag.tagName}
            subtitle={`${tag.mentions} ${mentionsLabel}`}
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
