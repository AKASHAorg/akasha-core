import React from 'react';

import { Tag } from '@akashaorg/typings/lib/ui';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import {
  DuplexButton,
  DuplexButtonActive,
  DuplexButtonHover,
  DuplexButtonInactive,
} from '@akashaorg/ui/lib/akasha-components/duplex-button';
import { CheckIcon, HashIcon, XIcon } from 'lucide-react';
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
          icon={<HashIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />}
          backgroundColor={true}
          labelSize={'button-lg'}
        />

        <div className={`w-28 py-1 shrink-0`}>
          {tag && (
            <DuplexButton
              active={subscribedTags?.includes(tag.name)}
              size="sm"
              loading={isLoading}
              className="w-[7rem]"
            >
              <DuplexButtonInactive
                onClick={() => handleSubscribeTag(tag.name)}
                variant={'outline'}
              >
                {subscribeLabel}
              </DuplexButtonInactive>

              <DuplexButtonHover
                variant="destructive"
                onClick={() => handleUnsubscribeTag(tag.name)}
              >
                <XIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
                {unsubscribeLabel}
              </DuplexButtonHover>

              <DuplexButtonActive variant={'outline'}>
                <CheckIcon />
                {subscribedLabel}
              </DuplexButtonActive>
            </DuplexButton>
          )}
        </div>
      </Stack>
    </Card>
  );
};

export default TagProfileCard;
