import React from 'react';
import { tw } from '@twind/core';
import { Tag } from '@akashaorg/typings/lib/ui';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import {
  CheckIcon,
  HashtagIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import SubtitleTextIcon from '@akashaorg/design-system-core/lib/components/SubtitleTextIcon';

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
  customStyle?: string;
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
    subscribeLabel,
    subscribedLabel,
    unsubscribeLabel,
    mentionsLabel,
    customStyle = '',
  } = props;

  return (
    <Card customStyle={customStyle}>
      <Stack direction="row" align="center" justify="between" spacing="gap-x-3">
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
              hoverColors={{
                background: { light: 'transparent', dark: 'transparent' },
                border: { light: 'errorLight', dark: 'errorDark' },
                text: { light: 'errorLight', dark: 'errorDark' },
                icon: { light: 'errorLight', dark: 'errorDark' },
              }}
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
