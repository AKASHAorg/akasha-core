import { Box, Text } from 'grommet';
import * as React from 'react';
import { Editor } from 'slate-react';
import styled from 'styled-components';
import { Avatar } from '../Avatar/index';
import { Icon } from '../Icon/index';
import { html } from './html-serialize';
import { initialValue } from './initialValue';
import { boldPlugin, codePlugin, italicPlugin, underlinePlugin } from './plugins';
import HoveringMenu from './format-toolbar';

interface IEditorBox {
  avatar?: string;
  ethAddress: string;
  publishTitle: string;
  placeholderTitle: string;
  onPublish: any;
}

const StyledDiv = styled.div`
  padding-right: ${props => `${props.theme.shapes.baseSpacing}px`};
  color: ${props => props.theme.colors.accent};
  opacity: 0.4;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

const StyledBox = styled(Box)`
  min-height: 200px;
  max-height: 612px;
`;

const plugins = [boldPlugin, codePlugin, italicPlugin, underlinePlugin];

const EditorBox: React.FC<IEditorBox> = props => {
  const { avatar, ethAddress, publishTitle, placeholderTitle, onPublish } = props;

  const [editorState, setEditorState] = React.useState(initialValue);

  const handlePublish = () => {
    const content = html.serialize(editorState);
    console.log(content);
    onPublish(ethAddress, editorState);
  };

  const handleChange = ({ value }: any) => {
    setEditorState(value);
  };

  return (
    <StyledBox pad="none" width="581px" justify="between">
      <Box direction="row" pad="medium" align="start" overflow="auto" className="scrollBox">
        <Avatar seed={ethAddress} src={avatar} />
        <Box width="480px" pad="small">
          <Editor
            value={editorState}
            onChange={handleChange}
            plugins={plugins}
            placeholder={placeholderTitle}
          />
        </Box>
        <Box width="480px" pad="small">
          <HoveringMenu />
        </Box>
      </Box>
      <Box
        direction="row"
        justify="between"
        fill="horizontal"
        pad={{ horizontal: 'medium', vertical: 'xsmall' }}
      >
        <Box direction="row" gap="xsmall" align="center">
          <Icon type="addAppDark" clickable={true} />
          <Icon type="quoteDark" clickable={true} />
          <Icon type="media" clickable={true} />
          <Icon type="emoji" clickable={true} />
        </Box>
        <StyledDiv onClick={handlePublish}>
          <Text size="large">{publishTitle}</Text>
        </StyledDiv>
      </Box>
    </StyledBox>
  );
};

export default EditorBox;
