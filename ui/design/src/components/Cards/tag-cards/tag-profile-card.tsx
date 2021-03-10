import { Box, Text } from 'grommet';
import React from 'react';
import { DuplexButton } from '../../Buttons/index';
import { Icon } from '../../Icon';
import { MainAreaCardBox } from '../common/basic-card-box';
import { ITag } from '../widget-cards/trending-widget-card';
import styled from 'styled-components';
import { isMobileOnly } from 'react-device-detect';

const TagIconDiv = styled.div`
  position: relative;
  top: -1.875em;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: ${props => props.theme.colors.lightBackground};
`;

const StyledInlineBox = styled(Box)`
  display: inline-flex;
`;

export interface ITagProfileCard {
  // data
  tag: ITag;
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
            <StyledInlineBox direction="row" gap="xsmall" align="center">
              <Text size="xlarge" weight="bold" color="primaryText" truncate={true}>
                {tag.name}
              </Text>
            </StyledInlineBox>
            <Text size="medium" color="secondaryText">
              {`${tag.totalPosts} ${mentionsLabel}`}
            </Text>
          </Box>
        </Box>
        <Box width="7rem" pad={{ vertical: 'small' }}>
          <DuplexButton
            inactiveLabel={subscribeLabel}
            activeLabel={subscribedLabel}
            activeHoverLabel={unsubscribeLabel}
            onClickInactive={() => handleSubscribeTag(tag.name)}
            onClickActive={() => handleUnsubscribeTag(tag.name)}
            active={subscribedTags?.includes(tag.name)}
            icon={<Icon type="subscribe" />}
          />
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
