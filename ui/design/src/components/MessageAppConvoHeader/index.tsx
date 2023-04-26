import * as React from 'react';
import { Box, Text } from 'grommet';

import Avatar from '../Avatar';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export interface IMessageAppConvoHeaderProps {
  chatOwner: Profile['name'];
  chatOwnerAvatar: Profile['avatar'];
  chatOwnerUsername: Profile['name'];
  chatOwnerProfileId: Profile['did']['id'];
  onClickAvatar?: () => void;
}

const MessageAppConvoHeader: React.FC<IMessageAppConvoHeaderProps> = props => {
  const { chatOwner, chatOwnerAvatar, chatOwnerUsername, chatOwnerProfileId, onClickAvatar } =
    props;

  return (
    <Box
      direction="row"
      width="100%"
      align="center"
      pad="small"
      background="accent"
      round={{ corner: 'top', size: 'small' }}
    >
      <Avatar
        size="md"
        avatar={chatOwnerAvatar}
        profileId={chatOwnerProfileId}
        onClick={onClickAvatar}
      />
      <Box align="start" margin={{ left: 'small' }}>
        <Text size="xlarge" color="white" style={{ textTransform: 'capitalize' }}>
          {chatOwner}
        </Text>
        <Text size="medium" color="white">
          {`@${chatOwnerUsername}`}
        </Text>
      </Box>
    </Box>
  );
};

export default MessageAppConvoHeader;
