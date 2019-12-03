import { Box, Text } from 'grommet';
import * as React from 'react';
import { Editor as SlateEditor } from 'slate';
import { Editor, EditorProps } from 'slate-react';
import styled from 'styled-components';
import { Avatar } from '../Avatar/index';
import { IEntryData } from '../Cards/entry-box';
import { Icon } from '../Icon/index';
import EmbedBox from './embed-box';
import { FormatToolbar } from './format-toolbar';
import { html } from './html-serialize';
import { initialValue, schema } from './initialValue';
import { boldPlugin, codePlugin, commands, italicPlugin, underlinePlugin } from './plugins';
import { renderBlock, renderMark } from './renderers';

export interface IEditorBox {
  avatar?: string;
  ethAddress: string;
  publishTitle: string;
  placeholderTitle: string;
  onPublish: any;
  embedEntryData?: IEntryData;
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

const plugins = [boldPlugin, codePlugin, italicPlugin, underlinePlugin, commands];

const EditorBox: React.FC<IEditorBox> = props => {
  const { avatar, ethAddress, publishTitle, placeholderTitle, onPublish, embedEntryData } = props;

  const [editorState, setEditorState] = React.useState(initialValue);

  const menuRef: React.RefObject<HTMLElement> = React.useRef(null);

  const editorRef: React.RefObject<any> = React.useRef(null);

  const handleMediaClick = (event: React.SyntheticEvent<any, MouseEvent>) => {
    event.preventDefault();
    const src = window.prompt('Enter the URL of the image:');
    if (!src) {
      return;
    }
    if (editorRef && editorRef.current) {
      editorRef.current.insertImage(src);
    }
  };

  const updateMenu = () => {
    const menu = menuRef.current;
    if (!menu) {
      return;
    }

    const { fragment, selection } = editorState;

    if (selection.isBlurred || selection.isCollapsed || fragment.text === '') {
      menu.removeAttribute('style');
      return;
    }

    const native = window.getSelection();
    if (native) {
      const range = native.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      // menu.style.opacity = 1;
      menu.style.top = `${rect.top + window.pageYOffset - menu.offsetHeight}px`;

      menu.style.left = `${rect.left +
        window.pageXOffset -
        menu.offsetWidth / 2 +
        rect.width / 2}px`;
    }
  };

  React.useEffect(() => updateMenu());

  const renderEditor = (_props: EditorProps, editor: SlateEditor, next: () => any) => {
    const children = next();
    return (
      <React.Fragment>
        {children}
        <FormatToolbar ref={menuRef} editor={editor} />
      </React.Fragment>
    );
  };

  const handlePublish = () => {
    const content = html.serialize(editorState);
    console.log(content);
    onPublish(ethAddress, editorState);
  };

  const handleChange = ({ value }: SlateEditor) => {
    setEditorState(value);
  };

  return (
    <StyledBox pad="none" width="581px" justify="between">
      <Box direction="row" pad="medium" align="start" overflow="auto" className="scrollBox">
        <Avatar seed={ethAddress} src={avatar} />
        <Box width="480px" pad={{ horizontal: 'small' }}>
          <Editor
            ref={editorRef}
            value={editorState}
            onChange={handleChange}
            plugins={plugins}
            placeholder={placeholderTitle}
            renderEditor={renderEditor}
            renderBlock={renderBlock}
            renderMark={renderMark}
            spellCheck={false}
            autoCorrect={false}
            autoFocus={true}
            schema={schema}
          />
          {embedEntryData && <EmbedBox embedEntryData={embedEntryData} />}
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
          <Icon type="quote" clickable={true} />
          <Icon type="media" clickable={true} onClick={handleMediaClick} />
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
