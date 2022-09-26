import * as React from 'react';
import { Box, Text } from 'grommet';
import { Descendant } from 'slate';
import Spinner from '../Spinner';
import styled from 'styled-components';

export const StyledBox = styled(Box)`
  height: 25rem;
  overflow: auto;
`;

export interface IChatMessage {
  name: string;
  username: string;
  ethAddress: string;
  read?: boolean;
  content: Descendant[];
  timestamp: string;
  id?: string;
  from?: string;
  to?: string;
}
export interface IChatListProps {
  emptyChatLabel: string;
  fetchingMessagesLabel?: string;
  loggedUserEthAddress: string;
  itemCard: React.ReactElement;
  fetchingMessages?: boolean;
  chatArr: IChatMessage[]; // @TODO: update with correct typing from sdk
}

const ChatList: React.FC<IChatListProps> = props => {
  const {
    emptyChatLabel,
    loggedUserEthAddress,
    itemCard,
    chatArr,
    fetchingMessages,
    fetchingMessagesLabel,
  } = props;

  const chatBottomRef = React.useRef(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView();
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chatArr]);

  if (!chatArr?.length && fetchingMessages) {
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
      {chatArr.length < 1 && (
        <Text textAlign="center" margin={{ top: 'medium' }}>
          {emptyChatLabel}
        </Text>
      )}
      {chatArr.length > 1 &&
        chatArr.map((message: IChatMessage, id: number) => (
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
      <div ref={chatBottomRef} />
    </StyledBox>
  );
};

export default ChatList;
