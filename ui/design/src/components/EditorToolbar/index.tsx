import React from 'react';
import styled from 'styled-components';
import { Box } from 'grommet';
import { BorderType } from 'grommet/utils';

import Icon from '../Icon';
import IconDrop from './IconDrop';
import EmojiPopover from '../EmojiPopover';

export interface IEditorToolbarProps {
  dropOpen: string;
  fontColor?: string;
  listStyle: string;
  alignStyle: string;
  wrapperBorder?: BorderType;
  closeDrop: () => void;
  onDropOpen: (type: string) => void;
  onBoldClick: () => void;
  onItalicClick: () => void;
  onUnderlineClick: () => void;
  onStrikeThroughClick: () => void;
  onListIconClick: (iconType: string) => void;
  onAlignIconClick: (iconType: string) => void;
}

const StyledIcon = styled(Icon)`
  cursor: pointer;
`;

const EditorToolbar: React.FC<IEditorToolbarProps> = props => {
  const {
    wrapperBorder,
    dropOpen,
    fontColor = 'black',
    listStyle,
    alignStyle,
    closeDrop,
    onDropOpen,
    onBoldClick,
    onItalicClick,
    onUnderlineClick,
    onStrikeThroughClick,
    onListIconClick,
    onAlignIconClick,
  } = props;

  const emojiRef = React.useRef();
  const listStyleRef = React.useRef();
  const alignStyleRef = React.useRef();

  const listIcons = [
    { type: 'listBulleted', handler: () => onListIconClick('listBulleted') },
    { type: 'listNumbered', handler: () => onListIconClick('listNumbered') },
  ];

  const alignIcons = [
    { type: 'alignLeft', handler: () => onAlignIconClick('alignLeft') },
    { type: 'alignRight', handler: () => onAlignIconClick('alignRight') },
    { type: 'alignCenter', handler: () => onAlignIconClick('alignCenter') },
    { type: 'alignJustify', handler: () => onAlignIconClick('alignJustify') },
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

      {/* font color style */}
      <Box direction="row" align="center" onClick={() => onDropOpen('fontColor')}>
        <Box width="1.25rem" height="1.25rem" background={fontColor} round="xxsmall" />
        <Icon type="dropdown" />
      </Box>

      {/* text case style */}
      <Box direction="row" align="center" onClick={() => onDropOpen('textCase')}>
        <Icon type="textcase" plain={true} />
        <Icon type="dropdown" />
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
