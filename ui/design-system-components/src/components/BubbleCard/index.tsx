import * as React from 'react';
import dayjs from 'dayjs';
import { tw } from '@twind/core';
import { Descendant } from 'slate';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import ReadOnlyEditor from '../ReadOnlyEditor';
import { formatRelativeTime } from '@akashaorg/design-system-core/lib/utils';

export type BubbleCardProps = {
  locale: string;
  senderName?: string;
  youLabel: string;
  content?: Descendant[];
  isFromLoggedUser?: boolean;
  chatTimestamp?: string;
  handleMentionClick?: (id: string) => void;
  handleTagClick?: (name: string) => void;
  handleLinkClick?: (url: string) => void;
};

const BubbleCard: React.FC<BubbleCardProps> = props => {
  const {
    locale,
    senderName,
    youLabel,
    content,
    isFromLoggedUser,
    chatTimestamp,
    handleMentionClick,
    handleTagClick,
    handleLinkClick,
  } = props;

  const time = dayjs(+chatTimestamp / 1000000).format('HH:mm');
  const relativeTime = formatRelativeTime((+chatTimestamp / 1000000).toString(), locale);

  return (
    <div>
      <div className={tw(`flex flex-row justify-between mb-1`)}>
        <Text variant="body1">{isFromLoggedUser ? youLabel : senderName}</Text>
        <Text variant="subtitle1">{relativeTime}</Text>
      </div>
      <Card
        noBorderRadius
        customStyle="min-h-min" // allows cards to adjust in a y-scrollable container
      >
        <div className={tw(`p-2 cursor-pointer bg(grey9 dark:grey3)`)}>
          <div className={tw(`flex flex-row justify-between`)}>
            <div className={tw(`flex flex-row items-start`)}>
              <div className={tw(`flex flex-row items-start ml-2`)}>
                <ReadOnlyEditor
                  content={content}
                  handleMentionClick={handleMentionClick}
                  handleTagClick={handleTagClick}
                  handleLinkClick={handleLinkClick}
                />
              </div>
            </div>
            {/* should be used once we allow deleting messages */}
            {/* {isFromLoggedUser && (
              <div direction="row" height="fit-content" flex={{ shrink: 0 }} align="start">
                <Icon size="xs" plain={true} icon={<MoreDark />} />
              </div>
            )} */}
          </div>
          <div className={tw(`flex flex-row h-fit shrink-0 justify-end`)}>
            {chatTimestamp && <Text variant="subtitle1">{time}</Text>}
            {/* should be used once we have bidirectional read function */}
            {/* {isFromLoggedUser && <Icon size="sm" accentColor={isRead} type={iconType} />} */}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BubbleCard;
