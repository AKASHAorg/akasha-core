import React from 'react';
import { Box, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';

import { TagIconDiv, StyledInlineBox } from './styled-tag-card';

import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { ITag } from '../TrendingWidgetCard';

import DuplexButton from '../DuplexButton';
import { Icon } from '../Icon';
import { TextLine } from '../VirtualList/placeholders/entry-card-placeholder';

export interface ITagProfileCard {
  // data
  tag: ITag | null;
  subscribedTags: string[];
  loggedEthAddress?: string | null;
  // labels
  mentionsLabel?: string;
  subscribeLabel?: string;
  unsubscribeLabel?: string;
  subscribedLabel?: string;
  // handlers
  handleSubscribeTag: (tagName: string) => void;
  handleUnsubscribeTag: (tagName: string) => void;
}

const TagProfileCard: React.FC<ITagProfileCard> = props => {
  const {
    tag,
    subscribedTags,
    handleSubscribeTag,
    handleUnsubscribeTag,
    subscribeLabel,
    subscribedLabel,
    unsubscribeLabel,
    mentionsLabel,
  } = props;

  return (
    <MainAreaCardBox>
      <Box
        height={isMobileOnly ? '5.6rem' : '9rem'}
        background={{
          color: 'accent',

          repeat: 'no-repeat',
          size: 'cover',
        }}
        pad="none"
        round={{ corner: 'top', size: 'xsmall' }}
      />
      <Box
        height="70px"
        direction="row"
        justify="between"
        pad={{ bottom: 'medium' }}
        margin={{ horizontal: 'medium' }}
      >
        <Box direction="row">
          <TagIconDiv>
            <Icon type="hashtag" size="xl" accentColor={true} />
          </TagIconDiv>
          <Box pad={{ vertical: 'small', left: 'xsmall', right: 'small' }}>
            {tag && (
              <Box gap="xsmall">
                <StyledInlineBox direction="row" gap="xsmall" align="center">
                  <Text size="xlarge" weight="bold" color="primaryText" truncate={true}>
                    {tag.name}
                  </Text>
                </StyledInlineBox>
                <Text size="medium" color="secondaryText">
                  {`${tag.totalPosts} ${mentionsLabel}`}
                </Text>
              </Box>
            )}

            {!tag && (
              <Box gap="xsmall">
                <TextLine title="tagName" animated={false} width="140px" />
                <TextLine title="tagName" animated={false} width="80px" />
              </Box>
            )}
          </Box>
        </Box>
        <Box width="7rem" pad={{ vertical: 'small' }} flex={{ shrink: 0 }}>
          {tag && (
            <DuplexButton
              inactiveLabel={subscribeLabel}
              activeLabel={subscribedLabel}
              activeHoverLabel={unsubscribeLabel}
              onClickInactive={() => handleSubscribeTag(tag.name)}
              onClickActive={() => handleUnsubscribeTag(tag.name)}
              active={subscribedTags?.includes(tag.name)}
              icon={<Icon type="subscribe" />}
            />
          )}
        </Box>
      </Box>
    </MainAreaCardBox>
  );
};
TagProfileCard.defaultProps = {
  mentionsLabel: 'mentions',
  subscribeLabel: 'Subscribe',
  subscribedLabel: 'Subscribed',
  unsubscribeLabel: 'Unsubscribe',
};
export { TagProfileCard };
