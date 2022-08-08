import * as React from 'react';
import { Box, Text } from 'grommet';

import { IChat } from '../../utils/dummy-data';

export interface IChatListProps {
  emptyChatLabel: string;
  loggedUserEthAddress: string;
  itemCard: React.ReactElement;
  chatArr: IChat[]; // @TODO: update with correct typing from sdk
}

const ChatList: React.FC<IChatListProps> = props => {
  const { emptyChatLabel, loggedUserEthAddress, itemCard, chatArr } = props;

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
        chatArr.map((chat: IChat, id: number) => (
          <Box
            key={id}
            width="95%"
            margin={{ vertical: 'small' }}
            alignSelf={chat.ethAddress !== loggedUserEthAddress ? 'end' : 'start'}
            style={{ minHeight: 'min-content', flexShrink: 0 }}
          >
            {React.cloneElement(itemCard, {
              sender: chat.name,
              status: chat.status,
              isLoggedUser: chat.ethAddress === loggedUserEthAddress,
              chatTimeStamp: chat.timestamp,
              content: chat.content,
            })}
          </Box>
        ))}
    </Box>
  );
};

export default ChatList;
