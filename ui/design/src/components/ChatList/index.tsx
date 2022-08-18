import * as React from 'react';
import { Box, Text } from 'grommet';
import { Descendant } from 'slate';

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
  loggedUserEthAddress: string;
  itemCard: React.ReactElement;
  chatArr: IChatMessage[]; // @TODO: update with correct typing from sdk
}

const ChatList: React.FC<IChatListProps> = props => {
  const { emptyChatLabel, loggedUserEthAddress, itemCard, chatArr } = props;

  const chatBottomRef = React.useRef(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView();
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chatArr]);

  return (
    <Box
      pad={{ horizontal: 'xsmall' }}
      style={{ height: '25rem', maxHeight: '25rem', overflow: 'auto' }}
      direction="column"
    >
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
    </Box>
  );
};

export default ChatList;
