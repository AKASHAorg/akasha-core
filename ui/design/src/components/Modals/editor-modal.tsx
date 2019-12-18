import { Box, Layer, Text } from 'grommet';
import * as React from 'react';
// import ReactQuill from 'react-quill';
import styled from 'styled-components';
// import '../../../node_modules/react-quill/dist/quill.bubble.css';
import { Avatar } from '../Avatar/index';
import { Icon } from '../Icon/index';

export interface IEditorModal {
  className?: string;
  avatar?: string;
  ethAddress: string;
  closeModal: () => void;
  onClickAvatar: (ethAddress: string) => void;
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

const EditorModal: React.FC<IEditorModal> = props => {
  const {
    closeModal,
    avatar,
    ethAddress,
    className,
    onClickAvatar,
    publishTitle,
    // placeholderTitle,
    onPublish,
  } = props;

  const [
    editorState,
    // setEditorState
  ] = React.useState('');

  const handleClickAvatar = () => {
    onClickAvatar(ethAddress);
  };

  const handlePublish = () => {
    onPublish(ethAddress, avatar, editorState);
  };

  // const handleChange = (value: any) => {
  //   setEditorState(value);
  // };
  //
  // const modules = {
  //   toolbar: [
  //     [{ header: [1, 2, false] }],
  //     ['bold', 'italic', 'underline'],
  //     ['image', 'code-block'],
  //   ],
  // };

  return (
    <Layer onEsc={closeModal} onClickOutside={closeModal} modal={true} className={className}>
      <StyledBox pad="none" width="581px" justify="between">
        <Box direction="row" pad="medium" align="start" overflow="auto" className="scrollBox">
          <Avatar src={avatar || ethAddress} onClick={handleClickAvatar} />
          <Box width="480px">
            {/*<ReactQuill*/}
            {/*  value={editorState}*/}
            {/*  onChange={handleChange}*/}
            {/*  theme="bubble"*/}
            {/*  modules={modules}*/}
            {/*  placeholder={placeholderTitle}*/}
            {/*  scrollingContainer=".scrollBox"*/}
            {/*/>*/}
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
    </Layer>
  );
};

export default EditorModal;
