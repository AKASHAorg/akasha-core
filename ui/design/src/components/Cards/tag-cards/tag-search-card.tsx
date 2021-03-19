import React from 'react';
import { Box, Text } from 'grommet';

import { TagIconDiv, StyledInlineBox } from './styled-tag-card';

import { MainAreaCardBox } from '../common/basic-card-box';
import { ITag } from '../widget-cards/trending-widget-card';

import { DuplexButton } from '../../Buttons/index';
import { Icon } from '../../Icon';
import { TextLine } from '../../VirtualList/placeholders/entry-card-placeholder';

export interface ITagSearchCard {
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

const TagSearchCard: React.FC<ITagSearchCard> = props => {
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
      <Box direction="column" margin="small">
        <Box height="70px" direction="row" justify="between" margin="xxsmall">
          <Box direction="row" align="center">
            <TagIconDiv onSearchCard={true}>
              <Icon type="hashtag" size="xl" accentColor={true} />
            </TagIconDiv>
            <Box pad={{ vertical: 'small', left: 'xsmall', right: 'small' }}>
              {tag && (
                <Box>
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
          <Box width="7rem" flex={{ shrink: 0 }} justify="center">
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
      </Box>
    </MainAreaCardBox>
  );
};
TagSearchCard.defaultProps = {
  mentionsLabel: 'posts',
  subscribeLabel: 'Subscribe',
  subscribedLabel: 'Subscribed',
  unsubscribeLabel: 'Unsubscribe',
};
export { TagSearchCard };
