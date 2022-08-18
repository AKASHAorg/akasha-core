import * as React from 'react';
import { Descendant } from 'slate';
import { Box, Text } from 'grommet';

import Icon from '../Icon';
import { BasicCardBox } from '../EntryCard/basic-card-box';

import { formatRelativeTime, ILocale } from '../../utils/time';
import ReadOnlyEditor from '../ReadOnlyEditor';
import dayjs from 'dayjs';

export interface IBubbleCardProps {
  locale: ILocale;
  senderName?: string;
  youLabel: string;
  content?: Descendant[];
  isRead?: boolean;
  isFromLoggedUser?: boolean;
  chatTimestamp?: string;
  handleMentionClick?: (pubKey: string) => void;
  handleTagClick?: (name: string) => void;
  handleLinkClick?: (url: string) => void;
}

const BubbleCard: React.FC<IBubbleCardProps> = props => {
  const {
    locale,
    senderName,
    youLabel,
    content,
    isRead,
    isFromLoggedUser,
    chatTimestamp,
    handleMentionClick,
    handleTagClick,
    handleLinkClick,
  } = props;

  const chatStatusIcon = {
    sent: 'checkSimple',
    delivered: 'checkDouble',
    read: 'checkDouble',
  };

  const time = dayjs(+chatTimestamp / 1000000).format('HH:mm');
  const relativeTime = formatRelativeTime(+chatTimestamp / 1000000, locale);

  return (
    <Box>
      <Box direction="row" justify="between" margin={{ bottom: 'xsmall' }}>
        <Text>{isFromLoggedUser ? youLabel : senderName}</Text>
        <Text color="secondaryText">{relativeTime}</Text>
      </Box>
      <BasicCardBox
        noBorderRadius
        style={{ minHeight: 'min-content' }} // allows cards to adjust in a y-scrollable container
      >
        <Box pad="small" style={{ cursor: 'pointer' }} background="chatBackground">
          <Box direction="row" justify="between">
            <Box direction="row" align="start">
              <Box align="start" margin={{ left: 'small' }}>
                <ReadOnlyEditor
                  content={content}
                  handleMentionClick={handleMentionClick}
                  handleTagClick={handleTagClick}
                  handleLinkClick={handleLinkClick}
                />
              </Box>
            </Box>
            {isFromLoggedUser && (
              <Box direction="row" height="fit-content" flex={{ shrink: 0 }} align="start">
                <Icon size="xs" plain={true} type="moreDark" />
              </Box>
            )}
          </Box>
          <Box direction="row" height="fit-content" flex={{ shrink: 0 }} justify="end">
            {chatTimestamp && (
              <Text color="secondaryText" margin={{ ...(isRead && { right: 'xsmall' }) }}>
                {time}
              </Text>
            )}
            {isFromLoggedUser && (
              <Icon size="sm" accentColor={true} type={isRead ? 'checkDouble' : 'checkSimple'} />
            )}
          </Box>
        </Box>
      </BasicCardBox>
    </Box>
  );
};

export default BubbleCard;
