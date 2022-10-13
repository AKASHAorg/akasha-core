import React from 'react';
import { Box, Grommet } from 'grommet';

import ChatArea, { IChatAreaProps } from '.';

import EditorBox from '../Editor';
import ChatAreaHeader from '../ChatAreaHeader';
import ChatList from '../ChatList';
import BubbleCard from '../BubbleCard';
import { editorDefaultValue } from '../Editor/initialValue';

import lightTheme from '../../styles/themes/light/light-theme';
import { dummyChatArr } from '../../utils/dummy-data';

export default {
  title: 'Cards/ChatArea',
  component: ChatArea,
  argType: {},
};

const Template = (args: IChatAreaProps) => (
  <Grommet theme={lightTheme}>
    <Box width="42.5%" pad="none" align="center">
      <ChatArea {...args} />
    </Box>
  </Grommet>
);
const ethAddress = '0x003410490050000320006570034567114572000';

export const BaseChatArea = Template.bind({});

BaseChatArea.args = {
  headerElement: (
    <ChatAreaHeader
      name="Estelle Collier"
      userName="estellecollier"
      avatar={{ url: 'https://placebeard.it/360x360' }}
      ethAddress="0x003410490050000320006570034567114572021"
      onClickAvatar={() => null}
    />
  ),
  bodyElement: (
    <ChatList
      emptyChatLabel="Start by saying hello! 👋🏼"
      loggedUserEthAddress={ethAddress}
      itemCard={<BubbleCard locale="en" youLabel="You" />}
      oldMessages={dummyChatArr}
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
