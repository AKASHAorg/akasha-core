import React from 'react';
import { Box } from 'grommet';

import Icon from '../Icon';
import DuplexButton from '../DuplexButton';
import SubtitleTextIcon from '../SubtitleTextIcon';
import { StyledAnchor } from '../EntryCard/basic-card-box';

export interface ITagEntry {
  // @TODO: fix type of tag
  //   tags?: ITag[];
  tags?: any;
  subscribedTags?: string[];

  subscribeLabel: string;
  unsubscribeLabel: string;
  subscribedLabel: string;

  // anchor link
  tagAnchorLink: string;

  // handlers
  onClickTag: (tagName: string) => void;
  handleSubscribeTag: (tagName: string) => void;
  handleUnsubscribeTag: (tagName: string) => void;
}

const TagEntry: React.FC<ITagEntry> = props => {
  const {
    tags,
    subscribedTags,
    subscribeLabel,
    unsubscribeLabel,
    subscribedLabel,
    tagAnchorLink,
    onClickTag,
    handleSubscribeTag,
    handleUnsubscribeTag,
  } = props;

  return (
    <Box flex={false} pad={{ top: 'large' }} gap="medium">
      {tags &&
        tags.slice(0, 4).map((tag, index) => (
          <Box key={index} direction="row" justify="between">
            <StyledAnchor
              onClick={e => {
                e.preventDefault();
                return false;
              }}
              weight="normal"
              href={`${tagAnchorLink}/${tag.name || tag}`}
              label={
                <Box width="11rem" pad="none" align="start">
                  <SubtitleTextIcon
                    onClick={() => onClickTag(tag.name)}
                    label={`#${tag.name || tag}`}
                    subtitle={`Used in ${tag.totalPosts || 20} posts`}
                    labelSize="large"
                    gap="xxsmall"
                    maxWidth="10rem"
                  />
                </Box>
              }
            />
            <Box width="7rem">
              <DuplexButton
                inactiveLabel={subscribeLabel}
                activeLabel={subscribedLabel}
                activeHoverLabel={unsubscribeLabel}
                onClickInactive={() => handleSubscribeTag(tag.name || tag)}
                onClickActive={() => handleUnsubscribeTag(tag.name || tag)}
                active={subscribedTags?.includes(tag.name || tag)}
                icon={<Icon type="subscribe" />}
              />
            </Box>
          </Box>
        ))}
    </Box>
  );
};

export default TagEntry;
