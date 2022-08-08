import * as React from 'react';
import { Descendant } from 'slate';
import { Box, Text } from 'grommet';

import Icon from '../Icon';
import { BasicCardBox } from '../EntryCard/basic-card-box';

import { formatRelativeTime, ILocale } from '../../utils/time';
import ReadOnlyEditor from '../ReadOnlyEditor';
import dayjs from 'dayjs';

type chatStatus = 'sent' | 'delivered' | 'read';

export interface IBubbleCardProps {
  locale: ILocale;
  sender?: string;
  youLabel: string;
  content?: Descendant[];
  status?: chatStatus;
  isLoggedUser?: boolean;
  chatTimestamp?: string;
  handleMentionClick?: (pubKey: string) => void;
  handleTagClick?: (name: string) => void;
  handleLinkClick?: (url: string) => void;
}

const BubbleCard: React.FC<IBubbleCardProps> = props => {
  const {
    locale,
    sender,
    youLabel,
    content,
    status,
    isLoggedUser,
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

  const time = dayjs(chatTimestamp, 'HH:mm');

  return (
    <Box>
      <Box direction="row" justify="between" margin={{ bottom: 'xsmall' }}>
        <Text>{isLoggedUser ? youLabel : sender}</Text>
        <Text color="secondaryText">{formatRelativeTime(chatTimestamp, locale)}</Text>
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
            {isLoggedUser && (
              <Box direction="row" height="fit-content" flex={{ shrink: 0 }} align="start">
                <Icon size="xs" plain={true} type="moreDark" />
              </Box>
            )}
          </Box>
          <Box direction="row" height="fit-content" flex={{ shrink: 0 }} justify="end">
            {chatTimestamp && (
              <Text color="secondaryText" margin={{ ...(status && { right: 'xsmall' }) }}>
                {time}
              </Text>
            )}
            {isLoggedUser && status && (
              <Icon size="sm" accentColor={status === 'read'} type={chatStatusIcon[status]} />
            )}
          </Box>
        </Box>
      </BasicCardBox>
    </Box>
  );
};

export default BubbleCard;
