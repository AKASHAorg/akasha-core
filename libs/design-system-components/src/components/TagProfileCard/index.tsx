import React from 'react';
import { tw } from '@twind/core';
import { Tag } from '@akashaorg/typings/lib/ui';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import {
  CheckIcon,
  HashtagIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import SubtitleTextIcon from '@akashaorg/design-system-core/lib/components/SubtitleTextIcon';
import { cn } from '@akashaorg/ui/lib/library/utils';

export type TagProfileCard = {
  // data
  tag: Tag | null;
  subscribedTags: string[];
  isLoading: boolean;
  // labels
  mentionsLabel: string;
  subscribeLabel: string;
  unsubscribeLabel: string;
  subscribedLabel: string;
  className?: string;
  // handlers
  handleSubscribeTag: (tagName: string) => void;
  handleUnsubscribeTag: (tagName: string) => void;
};

/**
 * Component used as a header in the tag feed page, to display tag data
 */
const TagProfileCard: React.FC<TagProfileCard> = props => {
  const {
    tag,
    isLoading,
    subscribedTags,
    handleSubscribeTag,
    handleUnsubscribeTag,
    mentionsLabel = 'Beams',
    subscribeLabel = 'Subscribe',
    subscribedLabel = 'Subscribed',
    unsubscribeLabel = 'Unsubscribe',
    className = '',
  } = props;

  return (
    <Card className={cn(className)}>
      <Stack direction="row" alignItems="center" justifyContent="between" spacing={3}>
        <SubtitleTextIcon
          label={tag.name}
          subtitle={mentionsLabel}
          icon={<HashtagIcon />}
          backgroundColor={true}
          labelSize={'button-lg'}
        />

        <div className={tw(`w-28 py-1 shrink-0`)}>
          {tag && (
            <DuplexButton
              inactiveLabel={subscribeLabel}
              activeLabel={subscribedLabel}
              activeHoverLabel={unsubscribeLabel}
              activeIcon={<CheckIcon />}
              activeHoverIcon={<XMarkIcon />}
              fixedWidth={'w-[7rem]'}
              iconDirection="left"
              inactiveVariant="secondary"
              loading={isLoading}
              onClickInactive={() => handleSubscribeTag(tag.name)}
              onClickActive={() => handleUnsubscribeTag(tag.name)}
              active={subscribedTags?.includes(tag.name)}
            />
          )}
        </div>
      </Stack>
    </Card>
  );
};

export default TagProfileCard;
