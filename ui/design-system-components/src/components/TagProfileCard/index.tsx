import React from 'react';
import { tw } from '@twind/core';
import { ITag } from '@akashaorg/typings/ui';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

export interface ITagProfileCard {
  // data
  tag: ITag | null;
  subscribedTags: string[];
  loggedEthAddress?: string | null;
  // labels
  mentionsLabel?: string;
  subscribeLabel?: string;
  unsubscribeLabel?: string;
  subscribedLabel?: string;
  customStyle?: string;
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
    customStyle,
  } = props;

  return (
    <Card customStyle={customStyle}>
      <div className={tw(`h(24 sm:36) bg(secondaryLight dark:secondaryDark) rounded-t-lg`)} />
      <div className={tw(`h-16 flex flex-row justify-between pb-2 mx-2`)}>
        <div className={tw(`flex flex-row`)}>
          <div
            className={tw(
              `relative rounded-full flex items-center justify-items-center w-20 h-20 shrink-0`,
            )}
          >
            <Icon type="HashtagIcon" size="lg" accentColor={true} />
          </div>
          <div className={tw(`p-1`)}>
            {tag && (
              <div className={tw(`gap-1`)}>
                <div className={tw(`inline-flex flex-row gap-1 items-center`)}>
                  <Text variant="h3" truncate={true}>
                    {tag.name}
                  </Text>
                </div>
                <Text variant="subtitle1">{`${tag.totalPosts} ${mentionsLabel}`}</Text>
              </div>
            )}

            {!tag && (
              <div className={tw(`gap-1`)}>
                <TextLine title="tagName" animated={false} width="140px" />
                <TextLine title="tagName" animated={false} width="80px" />
              </div>
            )}
          </div>
        </div>
        <div className={tw(`w-28 py-1 shrink-0`)}>
          {tag && (
            <DuplexButton
              inactiveLabel={subscribeLabel}
              activeLabel={subscribedLabel}
              activeHoverLabel={unsubscribeLabel}
              onClickInactive={() => handleSubscribeTag(tag.name)}
              onClickActive={() => handleUnsubscribeTag(tag.name)}
              active={subscribedTags?.includes(tag.name)}
              icon={'RssIcon'}
            />
          )}
        </div>
      </div>
    </Card>
  );
};
TagProfileCard.defaultProps = {
  mentionsLabel: 'mentions',
  subscribeLabel: 'Subscribe',
  subscribedLabel: 'Subscribed',
  unsubscribeLabel: 'Unsubscribe',
};
export default TagProfileCard;
