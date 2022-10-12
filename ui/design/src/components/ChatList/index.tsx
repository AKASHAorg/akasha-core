import * as React from 'react';
import { Box, Text } from 'grommet';
import Spinner from '../Spinner';
import styled from 'styled-components';
import { IChatMessage } from '@akashaorg/typings/ui';

export const StyledBox = styled(Box)`
  height: 25rem;
  overflow: auto;
`;

export interface IChatListProps {
  emptyChatLabel: string;
  fetchingMessagesLabel?: string;
  unreadMessagesLabel?: string;
  loggedUserEthAddress: string;
  itemCard: React.ReactElement;
  fetchingMessages?: boolean;
  markLatestMessagesRead?: () => void;
  oldMessages: IChatMessage[]; // @TODO: update with correct typing from sdk
  newMessages?: IChatMessage[];
}

const ChatList: React.FC<IChatListProps> = props => {
  const {
    emptyChatLabel,
    loggedUserEthAddress,
    itemCard,
    oldMessages,
    newMessages,
    markLatestMessagesRead,
    fetchingMessages,
    fetchingMessagesLabel,
    unreadMessagesLabel,
  } = props;

  const chatBottomRef = React.useRef(null);
  const readMessagesBottomRef = React.useRef(null);

  const scrollToLatestReadMessage = () => {
    readMessagesBottomRef.current?.scrollIntoView();
  };

  React.useEffect(() => {
    scrollToLatestReadMessage();
  }, [oldMessages]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        markLatestMessagesRead();
      }
    });
    if (chatBottomRef?.current) {
      observer.observe(chatBottomRef?.current);
    }
    return () => observer.disconnect();
  }, [markLatestMessagesRead]);

  if (!oldMessages?.length && fetchingMessages) {
    return (
      <StyledBox align="center" justify="center">
        <>
          <Spinner />
          <Text>{fetchingMessagesLabel}</Text>
        </>
      </StyledBox>
    );
  }

  return (
    <StyledBox pad={{ horizontal: 'xsmall' }} direction="column">
      {oldMessages.length < 1 && (
        <Text textAlign="center" margin={{ top: 'medium' }}>
          {emptyChatLabel}
        </Text>
      )}
      {oldMessages.length > 1 &&
        oldMessages.map((message: IChatMessage, id: number) => (
          <Box
            key={id}
            width="95%"
            margin={{ vertical: 'small' }}
            alignSelf={message.ethAddress !== loggedUserEthAddress ? 'end' : 'start'}
            style={{ minHeight: 'min-content', flexShrink: 0 }}
          >
            {React.cloneElement(itemCard, {
              senderName: message.name,
              isRead: message.read,
              isFromLoggedUser: message.ethAddress === loggedUserEthAddress,
              chatTimestamp: message.timestamp,
              content: message.content,
            })}
          </Box>
        ))}

      <div ref={readMessagesBottomRef} />

      {newMessages?.length > 1 && (
        <Box
          background="activePanelBackground"
          pad={{ horizontal: 'medium', vertical: 'xxsmall' }}
          round="100px"
          flex={{ shrink: 0 }}
        >
          <Text color="accent">{unreadMessagesLabel}</Text>
        </Box>
      )}

      {newMessages?.length > 1 &&
        newMessages?.map((message: IChatMessage, index: number) => (
          <Box
            key={index}
            width="95%"
            margin={{ vertical: 'small' }}
            alignSelf={message.ethAddress !== loggedUserEthAddress ? 'end' : 'start'}
            style={{ minHeight: 'min-content', flexShrink: 0 }}
            ref={index === newMessages.length - 1 ? chatBottomRef : null}
          >
            {React.cloneElement(itemCard, {
              senderName: message.name,
              isRead: message.read,
              isFromLoggedUser: message.ethAddress === loggedUserEthAddress,
              chatTimestamp: message.timestamp,
              content: message.content,
            })}
          </Box>
        ))}
      {/* <div ref={chatBottomRef} /> */}
    </StyledBox>
  );
};

export default ChatList;
