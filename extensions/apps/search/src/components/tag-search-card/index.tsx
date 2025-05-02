import React from 'react';

import { Tag } from '@akashaorg/typings/lib/ui';

import Link from '@akashaorg/design-system-core/lib/components/Link';
import { HashIcon } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import SubtitleTextIcon from '@akashaorg/design-system-core/lib/components/SubtitleTextIcon';

export type TagSearchCardProps = {
  // data
  tag: Tag | null;
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

/**
 * Component used to showcase tags in the search app
 */
const TagSearchCard: React.FC<TagSearchCardProps> = props => {
  const {
    tag,
    subscribedTags,
    subscribeLabel = 'Subscribe',
    subscribedLabel = 'Subscribed',
    unsubscribeLabel = 'Unsubscribe',
    tagAnchorLink,
    onClickTag,
    handleSubscribeTag,
    handleUnsubscribeTag,
  } = props;

  return (
    <Stack direction="row" alignItems="center" justifyContent="between" className="py-2">
      <Link onClick={onClickTag} to={`${tagAnchorLink}/${tag?.name}`}>
        <Stack alignItems="center" justifyContent="between" className="py-2">
          {tag && (
            <SubtitleTextIcon
              onClick={onClickTag}
              label={tag.name}
              subtitle={`${tag.totalPosts} Beams`}
              icon={<HashIcon className="h-5 w-5" />}
              backgroundColor={true}
            />
          )}

          {!tag && (
            <Stack alignItems="center" justifyContent="between" className="py-2">
              <TextLine title="tagName" animated={false} width="140px" />
              <TextLine title="tagName" animated={false} width="80px" />
            </Stack>
          )}
        </Stack>
      </Link>
      {tag && (
        <Stack>
          <DuplexButton
            inactiveLabel={subscribeLabel}
            activeLabel={subscribedLabel}
            activeHoverLabel={unsubscribeLabel}
            onClickInactive={() => handleSubscribeTag(tag.name)}
            onClickActive={() => handleUnsubscribeTag(tag.name)}
            active={subscribedTags?.includes(tag.name)}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default TagSearchCard;
