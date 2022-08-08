import * as React from 'react';
import { Box } from 'grommet';

export interface IChatAreaProps {
  headerElement: React.ReactElement;
  bodyElement: React.ReactElement;
  editorElement: React.ReactElement;
}

const ChatArea: React.FC<IChatAreaProps> = props => {
  const { headerElement, bodyElement, editorElement } = props;

  return (
    <Box
      width="100%"
      background="convoAreaBackground"
      round={{ size: 'small' }}
      border={{ side: 'all', size: '1px', color: 'border' }}
    >
      {headerElement}
      {bodyElement}
      {editorElement}
    </Box>
  );
};

export default ChatArea;
