import React from 'react';

import { ITag } from '@akashaorg/typings/lib/ui';

import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import { HashtagIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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

  return (
    <Stack align="center" justify="between" customStyle={'py-2'}>
      <Anchor
        onClick={e => {
          e.preventDefault();
          return false;
        }}
        href={`${tagAnchorLink}/${tag?.name}`}
      >
        <button onClick={onClickTag}>
          <Stack align="center" justify="between" customStyle={'py-2'}>
            {tag && (
              <SubtitleTextIcon
                onClick={onClickTag}
                label={tag.name}
                subtitle={`${tag.totalPosts} Beams`}
                icon={<HashtagIcon />}
                backgroundColor={true}
              />
            )}

            {!tag && (
              <Stack align="center" justify="between" customStyle={'py-2'}>
                <TextLine title="tagName" animated={false} width="140px" />
                <TextLine title="tagName" animated={false} width="80px" />
              </Stack>
            )}
          </Stack>
        </button>
      </Anchor>
      {tag && (
        <Stack>
          <DuplexButton
            inactiveLabel={subscribeLabel}
            activeLabel={subscribedLabel}
            activeHoverLabel={unsubscribeLabel}
            onClickInactive={() => handleSubscribeTag(tag.name)}
            onClickActive={() => handleUnsubscribeTag(tag.name)}
            active={subscribedTags?.includes(tag.name)}
            allowMinimization={false}
          />
        </Stack>
      )}
    </Stack>
  );
};
TagSearchCard.defaultProps = {
  // mentionsLabel: 'beams',
  subscribeLabel: 'Subscribe',
  subscribedLabel: 'Subscribed',
  unsubscribeLabel: 'Unsubscribe',
};
export default TagSearchCard;
