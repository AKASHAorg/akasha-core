import * as React from 'react';
import { Box, Text } from 'grommet';

import { IProfileData } from '@akashaorg/ui-awf-typings/lib/profile';

import Avatar from '../Avatar';

export interface IMessageAppConvoHeaderProps {
  chatOwner: IProfileData['name'];
  chatOwnerAvatar: IProfileData['avatar'];
  chatOwnerUsername: IProfileData['userName'];
  chatOwnerEthAddress: IProfileData['ethAddress'];
  onClickAvatar?: () => void;
}

const MessageAppConvoHeader: React.FC<IMessageAppConvoHeaderProps> = props => {
  const { chatOwner, chatOwnerAvatar, chatOwnerUsername, chatOwnerEthAddress, onClickAvatar } =
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
        src={chatOwnerAvatar}
        ethAddress={chatOwnerEthAddress}
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
