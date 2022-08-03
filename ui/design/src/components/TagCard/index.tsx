import * as React from 'react';
import styled from 'styled-components';
import { ITag } from '@akashaorg/typings/ui';
import { Box } from 'grommet';
import SubtitleTextIcon from '../SubtitleTextIcon';
import DuplexButton from '../DuplexButton';
import { IMentionData } from '../AreaChart';
import ResponsiveChart from '../ResponsiveChart';
import Icon from '../Icon';
import { useViewportSize } from '../Providers/viewport-dimension';

const WrapperBox = styled(Box)`
  border-radius: ${props => props.theme.shapes.borderRadius};
`;

export interface ITagCard {
  tag: ITagData;
  mentionsLabel?: string;
  subscribeLabel?: string;
  subscribedLabel?: string;
  unsubscribeLabel?: string;
  handleSubscribe: (name: string) => void;
  handleUnsubscribe: (name: string) => void;
}

export interface ITagData extends ITag {
  tagHistoricData: IMentionData[];
  subscribed?: boolean;
}

const TagCard: React.FC<ITagCard> = props => {
  const {
    tag,
    mentionsLabel,
    subscribeLabel,
    unsubscribeLabel,
    subscribedLabel,
    handleSubscribe,
    handleUnsubscribe,
  } = props;

  const { size } = useViewportSize();

  const onSub = () => {
    handleSubscribe(tag.name);
  };

  const onUnsub = () => {
    handleUnsubscribe(tag.name);
  };

  const renderContent = () => {
    if (size === 'small') {
      return (
        <Box direction="column" align="center" pad={{ vertical: 'small' }}>
          <Box
            direction="row"
            justify="between"
            align="center"
            fill="horizontal"
            pad={{ top: 'small' }}
          >
            <SubtitleTextIcon
              label={tag.name}
              subtitle={`${tag.totalPosts} ${mentionsLabel}`}
              gap="xxsmall"
            />
            <Box width="8rem">
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
          <Box width="20rem" height="5.4rem">
            <ResponsiveChart data={tag.tagHistoricData} />
          </Box>
        </Box>
      );
    }
    return (
      <Box direction="row" justify="between" align="center">
        <SubtitleTextIcon
          label={tag.name}
          subtitle={`${tag.totalPosts} ${mentionsLabel}`}
          gap="xxsmall"
        />
        <Box basis="72%" justify="between" direction="row" align="center">
          <Box width="13rem" height="4.4rem">
            <ResponsiveChart data={tag.tagHistoricData} />
          </Box>
          <Box width="8rem">
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
      </Box>
    );
  };
  return (
    <WrapperBox
      background="ultraLightBackground"
      border={{ side: 'all', color: 'border', size: 'xsmall', style: 'solid' }}
      pad={{ horizontal: 'small' }}
      flex={{ shrink: 0 }}
      responsive={false}
    >
      {renderContent()}
    </WrapperBox>
  );
};

TagCard.defaultProps = {
  mentionsLabel: 'mentions',
  subscribeLabel: 'Subscribe',
  subscribedLabel: 'Subscribed',
  unsubscribeLabel: 'Unsubscribe',
};

export default TagCard;
