import * as React from 'react';
import { Box, Text } from 'grommet';

import ReadOnlyEditor from '../ReadOnlyEditor';

import { IChat } from '../../utils/dummy-data';

export interface IMessageAppConvoBodyProps {
  emptyChatLabel: string;
  loggedUserEthAddress: string;
  itemCard: React.ReactElement;
  chatArr: IChat[]; // @TODO: update with correct typing from sdk
  onMentionClick: () => void;
  onTagClick: () => void;
  onLinkClick: () => void;
}

const MessageAppConvoBody: React.FC<IMessageAppConvoBodyProps> = props => {
  const {
    emptyChatLabel,
    loggedUserEthAddress,
    itemCard,
    chatArr,
    onMentionClick,
    onTagClick,
    onLinkClick,
  } = props;

  const handleMentionClick = () => {
    if (onMentionClick) {
      onMentionClick();
    }
  };
  const handleTagClick = () => {
    if (onTagClick) {
      onTagClick();
    }
  };
  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <Box
      pad={{ horizontal: 'xsmall' }}
      style={{ height: '25rem', maxHeight: '25rem', overflow: 'auto' }}
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
              content: (
                <ReadOnlyEditor
                  content={chat.content}
                  handleMentionClick={handleMentionClick}
                  handleTagClick={handleTagClick}
                  handleLinkClick={handleLinkClick}
                />
              ),
            })}
          </Box>
        ))}
    </Box>
  );
};

export default MessageAppConvoBody;
