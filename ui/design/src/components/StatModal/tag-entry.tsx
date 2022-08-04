import React from 'react';
import { Box } from 'grommet';
import { ITag } from '@akashaorg/typings/ui';

import Icon from '../Icon';
import DuplexButton from '../DuplexButton';
import SubtitleTextIcon from '../SubtitleTextIcon';
import { StyledAnchor } from '../EntryCard/basic-card-box';

export interface ITagEntry {
  tags?: ITag[];
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
        tags.map((tag, index) => (
          <Box key={index} direction="row" justify="between">
            <StyledAnchor
              onClick={e => {
                e.preventDefault();
                return false;
              }}
              weight="normal"
              href={`${tagAnchorLink}/${tag.name}`}
              label={
                <Box width="11rem" pad="none" align="start">
                  <SubtitleTextIcon
                    onClick={() => onClickTag(tag.name)}
                    label={`#${tag.name}`}
                    subtitle={`Used in ${tag.totalPosts} posts`}
                    labelSize="large"
                    gap="xxsmall"
                    maxWidth="10rem"
                  />
                </Box>
              }
            />
            <Box>
              <DuplexButton
                inactiveLabel={subscribeLabel}
                activeLabel={subscribedLabel}
                activeHoverLabel={unsubscribeLabel}
                onClickInactive={() => handleSubscribeTag(tag.name)}
                onClickActive={() => handleUnsubscribeTag(tag.name)}
                active={subscribedTags?.includes(tag.name)}
                icon={<Icon type="subscribe" />}
                allowMinimization
              />
            </Box>
          </Box>
        ))}
    </Box>
  );
};

export default TagEntry;
