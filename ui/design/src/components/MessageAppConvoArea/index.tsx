import * as React from 'react';
import { Box } from 'grommet';

export interface IMessageAppConvoAreaProps {
  headerElement: React.ReactElement;
  bodyElement: React.ReactElement;
  editorElement: React.ReactElement;
}

const MessageAppConvoArea: React.FC<IMessageAppConvoAreaProps> = props => {
  const { headerElement, bodyElement, editorElement } = props;

  return (
    <Box width="100%" background="convoAreaBackground" round={{ size: 'small' }}>
      {headerElement}
      {bodyElement}
      {editorElement}
    </Box>
  );
};

export default MessageAppConvoArea;
