import React from 'react';
import styled from 'styled-components';
import { Box } from 'grommet';
import { BorderType } from 'grommet/utils';

import Icon from '../Icon';
import IconDrop from './IconDrop';
import EmojiPopover from '../EmojiPopover';

export interface IEditorToolbarProps {
  dropOpen: string;
  caseStyle: string;
  listStyle: string;
  alignStyle: string;
  wrapperBorder?: BorderType;
  closeDrop: () => void;
  onDropOpen: (type: string) => void;
  onIconClick: (iconType: string) => void;
  onBoldClick: () => void;
  onItalicClick: () => void;
  onUnderlineClick: () => void;
  onStrikeThroughClick: () => void;
}

const StyledIcon = styled(Icon)`
  cursor: pointer;
`;

const EditorToolbar: React.FC<IEditorToolbarProps> = props => {
  const {
    wrapperBorder,
    dropOpen,
    caseStyle,
    listStyle,
    alignStyle,
    closeDrop,
    onDropOpen,
    onIconClick,
    onBoldClick,
    onItalicClick,
    onUnderlineClick,
    onStrikeThroughClick,
  } = props;

  const emojiRef = React.useRef();
  const caseStyleRef = React.useRef();
  const listStyleRef = React.useRef();
  const alignStyleRef = React.useRef();

  const caseIcons = [
    { type: 'textcaseSentence', handler: () => onIconClick('textcaseSentence') },
    { type: 'textcaseLower', handler: () => onIconClick('textcaseLower') },
    { type: 'textcaseUpper', handler: () => onIconClick('textcaseUpper') },
  ];

  const listIcons = [
    { type: 'listBulleted', handler: () => onIconClick('listBulleted') },
    { type: 'listNumbered', handler: () => onIconClick('listNumbered') },
  ];

  const alignIcons = [
    { type: 'alignLeft', handler: () => onIconClick('alignLeft') },
    { type: 'alignRight', handler: () => onIconClick('alignRight') },
    { type: 'alignCenter', handler: () => onIconClick('alignCenter') },
    { type: 'alignJustify', handler: () => onIconClick('alignJustify') },
  ];

  return (
    <Box direction="row" justify="center" pad="small" gap="small" border={wrapperBorder}>
      {/* emoji */}
      <Box direction="row">
        <StyledIcon
          type="emoji"
          size="md"
          onClick={() => onDropOpen('emoji')}
          ref={emojiRef}
          testId="emoji-icon"
        />
        {/* emojis dropdown */}
        {emojiRef.current && dropOpen === 'emoji' && (
          <EmojiPopover
            target={emojiRef.current}
            onClickEmoji={() => null}
            closePopover={closeDrop}
          />
        )}
      </Box>

      {/* uncomment this code to enable color-picker. You must install react-color, or react-colorful -
      a light weight alternative (recommended) */}

      {/* font color style */}
      {/* <Box direction="row">
        <Box direction="row" align="center" onClick={() => onDropOpen('color')} ref={colorRef}>
          <Box width="1.25rem" height="1.25rem" background={fontColor} round="xxsmall" />
          <Icon type="dropdown" />
        </Box>

        {colorRef.current && dropOpen === 'color' && (
          <StyledDrop
            overflow="hidden"
            target={caseStyleRef.current}
            align={{ top: 'bottom', right: 'right' }}
            onClickOutside={closeDrop}
            onEsc={closeDrop}
          >
            <SketchPicker />
          </StyledDrop>
        )}
      </Box> */}

      {/* text case style */}
      <Box direction="row">
        <Box direction="row" align="center" onClick={() => onDropOpen('case')} ref={caseStyleRef}>
          <Icon type={caseStyle} size="sm" plain={true} />
          <Icon type="dropdown" />
        </Box>
        {/* text case styles dropdown */}
        {caseStyleRef.current && dropOpen === 'case' && (
          <IconDrop target={caseStyleRef.current} dropItems={caseIcons} onMenuClose={closeDrop} />
        )}
      </Box>

      {/* font style */}
      <StyledIcon type="boldAlt" onClick={onBoldClick} />
      <StyledIcon type="italic" plain={true} onClick={onItalicClick} />
      <StyledIcon type="underline" plain={true} onClick={onUnderlineClick} />
      <StyledIcon type="strikethrough" plain={true} onClick={onStrikeThroughClick} />

      {/* list style */}
      <Box direction="row">
        <Box direction="row" align="center" onClick={() => onDropOpen('list')} ref={listStyleRef}>
          <Icon type={listStyle} size="sm" plain={true} />
          <Icon type="dropdown" />
        </Box>
        {/* list styles dropdown */}
        {listStyleRef.current && dropOpen === 'list' && (
          <IconDrop target={listStyleRef.current} dropItems={listIcons} onMenuClose={closeDrop} />
        )}
      </Box>

      {/* align style */}
      <Box direction="row">
        <Box direction="row" align="center" onClick={() => onDropOpen('align')} ref={alignStyleRef}>
          <Icon type={alignStyle} size="sm" plain={true} />
          <Icon type="dropdown" />
        </Box>
        {/* align styles dropdown */}
        {alignStyleRef.current && dropOpen === 'align' && (
          <IconDrop target={alignStyleRef.current} dropItems={alignIcons} onMenuClose={closeDrop} />
        )}
      </Box>
    </Box>
  );
};

export default EditorToolbar;
