import React from 'react';

import { ITag } from '@akashaorg/typings/ui';

import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import SubtitleTextIcon from '@akashaorg/design-system-core/lib/components/SubtitleTextIcon';

export type TagSearchCardProps = {
  // data
  tag: ITag | null;
  subscribedTags: string[];
  loggedEthAddress?: string | null;
  // labels
  subscribeLabel?: string;
  unsubscribeLabel?: string;
  subscribedLabel?: string;
  // anchor link
  tagAnchorLink: string;
  // handlers
  onClickTag?: React.EventHandler<React.SyntheticEvent>;
  handleSubscribeTag: (tagName: string) => void;
  handleUnsubscribeTag: (tagName: string) => void;
};

const TagSearchCard: React.FC<TagSearchCardProps> = props => {
  const {
    tag,
    subscribedTags,
    subscribeLabel,
    subscribedLabel,
    unsubscribeLabel,
    tagAnchorLink,
    onClickTag,
    handleSubscribeTag,
    handleUnsubscribeTag,
  } = props;

  const BaseItemStyles = `
    flex justify-between items-center py-2
    `;

  return (
    <Box customStyle={BaseItemStyles}>
      <Anchor
        onClick={e => {
          e.preventDefault();
          return false;
        }}
        href={`${tagAnchorLink}/${tag?.name}`}
      >
        <Box customStyle={BaseItemStyles} onClick={onClickTag}>
          {tag && (
            <SubtitleTextIcon
              onClick={onClickTag}
              label={tag.name}
              subtitle={`${tag.totalPosts} Beams`}
              iconType="HashtagIcon"
              backgroundColor={true}
            />
          )}

          {!tag && (
            <Box customStyle={BaseItemStyles}>
              <TextLine title="tagName" animated={false} width="140px" />
              <TextLine title="tagName" animated={false} width="80px" />
            </Box>
          )}
        </Box>
      </Anchor>
      {tag && (
        <Box>
          <DuplexButton
            inactiveLabel={subscribeLabel}
            activeLabel={subscribedLabel}
            activeHoverLabel={unsubscribeLabel}
            onClickInactive={() => handleSubscribeTag(tag.name)}
            onClickActive={() => handleUnsubscribeTag(tag.name)}
            active={subscribedTags?.includes(tag.name)}
            allowMinimization={false}
          />
        </Box>
      )}
    </Box>
  );
};
TagSearchCard.defaultProps = {
  // mentionsLabel: 'beams',
  subscribeLabel: 'Subscribe',
  subscribedLabel: 'Subscribed',
  unsubscribeLabel: 'Unsubscribe',
};
export default TagSearchCard;
