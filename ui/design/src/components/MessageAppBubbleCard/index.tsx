import * as React from 'react';
import { Box, Text } from 'grommet';
import { isMobileOnly } from 'react-device-detect';

import Icon from '../Icon';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';
import { IconDiv } from '../TopBar/styled-topbar';

import { formatRelativeTime, ILocale } from '../../utils/time';

type chatStatus = 'sent' | 'delivered' | 'read';

export interface IMessageAppBubbleCardProps {
  locale: ILocale;
  sender: string;
  youLabel: string;
  content: string;
  status: chatStatus;
  isLoggedUser: boolean;
  chatTimestamp: string;
}

const MessageAppBubbleCard: React.FC<IMessageAppBubbleCardProps> = props => {
  const { locale, sender, youLabel, content, status = 'sent', isLoggedUser, chatTimestamp } = props;

  const chatStatusIcon = {
    sent: 'checkSimple',
    delivered: 'checkDouble',
    read: 'checkDouble',
  };

  const [isActive, setIsActive] = React.useState(false);

  const handleIconClick = () => setIsActive(!isActive);

  const time = chatTimestamp?.split('T')[1].split(':');

  return (
    <Box>
      <Box direction="row" justify="between" margin={{ bottom: 'xsmall' }}>
        <Text color="secondaryText">{isLoggedUser ? youLabel : sender}</Text>
        <Text color="secondaryText">{formatRelativeTime(chatTimestamp, locale)}</Text>
      </Box>
      <MainAreaCardBox
        noBorderRadius
        style={{ minHeight: 'min-content' }} // allows cards to adjust in a y-scrollable container
      >
        <Box pad="small" style={{ cursor: 'pointer' }}>
          <Box direction="row" justify="between">
            <Box direction="row" align="start">
              <Box align="start" margin={{ left: 'small' }}>
                <Text size="large">{content}</Text>
              </Box>
            </Box>
            <Box direction="row" height="fit-content" flex={{ shrink: 0 }} align="start">
              <IconDiv onClick={handleIconClick} isActive={isActive} isMobile={isMobileOnly}>
                <Icon size="xs" plain={true} accentColor={isActive} type="moreDark" />
              </IconDiv>
            </Box>
          </Box>
          <Box direction="row" height="fit-content" flex={{ shrink: 0 }} justify="end">
            {chatTimestamp && (
              <Text
                color="secondaryText"
                margin={{ right: 'xsmall' }}
              >{`${time[0]}:${time[1]}`}</Text>
            )}
            <Icon size="sm" accentColor={status === 'read'} type={chatStatusIcon[status]} />
          </Box>
        </Box>
      </MainAreaCardBox>
    </Box>
  );
};

export default MessageAppBubbleCard;
