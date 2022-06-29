import React from 'react';
import { Box, Grommet } from 'grommet';

import MessageAppConvoHeader, { IMessageAppConvoHeaderProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Cards/MessageAppConvoHeader',
  component: MessageAppConvoHeader,
  argType: {
    chatOwner: { control: 'text' },
    chatOwnerAvatar: { control: 'text' },
    chatOwnerUsername: { control: 'text' },
    chatOwnerEthAddress: { control: 'text' },
    onClickAvatar: { action: 'avatar clicked' },
  },
};

const Template = (args: IMessageAppConvoHeaderProps) => (
  <Grommet theme={lightTheme}>
    <Box width="42.5%" pad="none" align="center">
      <MessageAppConvoHeader {...args} />
    </Box>
  </Grommet>
);

const ethAddress = '0x003410490050000320006570034567114572000';

export const BaseMessageAppConvoHeader = Template.bind({});

BaseMessageAppConvoHeader.args = {
  chatOwner: 'Estelle Collier',
  chatOwnerUsername: 'estellecollier',
  chatOwnerAvatar: { url: 'https://placebeard.it/360x360' },
  chatOwnerEthAddress: ethAddress,
};
