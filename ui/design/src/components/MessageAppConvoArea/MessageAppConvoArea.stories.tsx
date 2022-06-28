import React from 'react';
import { Box, Grommet } from 'grommet';

import MessageAppConvoArea, { IMessageAppConvoAreaProps } from '.';

import EditorBox from '../Editor';
import MessageAppConvoHeader from '../MessageAppConvoHeader';
import MessageAppConvoBody from '../MessageAppConvoBody';
import BubbleCard from '../BubbleCard';
import { editorDefaultValue } from '../Editor/initialValue';

import lightTheme from '../../styles/themes/light/light-theme';
import { dummyChatArr } from '../../utils/dummy-data';

export default {
  title: 'Cards/MessageAppConvoArea',
  component: MessageAppConvoArea,
  argType: {},
};

const Template = (args: IMessageAppConvoAreaProps) => (
  <Grommet theme={lightTheme}>
    <Box width="42.5%" pad="none" align="center">
      <MessageAppConvoArea {...args} />
    </Box>
  </Grommet>
);
const ethAddress = '0x003410490050000320006570034567114572000';

export const BaseMessageAppConvoArea = Template.bind({});

BaseMessageAppConvoArea.args = {
  headerElement: (
    <MessageAppConvoHeader
      chatOwner="Estelle Collier"
      chatOwnerUsername="estellecollier"
      chatOwnerAvatar={{ url: 'https://placebeard.it/360x360' }}
      chatOwnerEthAddress="0x003410490050000320006570034567114572021"
      onClickAvatar={() => null}
    />
  ),
  bodyElement: (
    <MessageAppConvoBody
      emptyChatLabel="Start by saying hello! 👋🏼"
      loggedUserEthAddress={ethAddress}
      itemCard={<BubbleCard locale="en" youLabel="You" />}
      chatArr={dummyChatArr}
      onMentionClick={() => null}
      onTagClick={() => null}
      onLinkClick={() => null}
    />
  ),
  editorElement: (
    <Box
      border={{ side: 'all', size: '1px', color: 'border' }}
      margin="xsmall"
      background="cardBackground"
    >
      <EditorBox
        showAvatar={false}
        ethAddress={ethAddress}
        placeholderLabel="Type a message"
        emojiPlaceholderLabel="Search"
        postLabel="Send"
        getLinkPreview={() => null}
        getMentions={() => null}
        getTags={() => null}
        onPublish={() => null}
        withMeter={true}
        editorState={editorDefaultValue}
        setEditorState={() => null}
      />
    </Box>
  ),
};
