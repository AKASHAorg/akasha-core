import React from 'react';

import { StyledListElem } from './styled-emoji-popover';

export interface IEmojiData {
  n: string[];
  u: string;
  v?: string[];
}

export interface IRenderEmojiProps {
  elem: IEmojiData;
  index: number;
  onClickEmoji: (emojiCode: string) => void;
  setHoveredEmoji: React.Dispatch<
    React.SetStateAction<{
      emojiCode: string;
      emojiName: string;
    }>
  >;
  closePopover: () => void;
}

const RenderEmoji: React.FC<IRenderEmojiProps> = props => {
  const { elem, index, onClickEmoji, setHoveredEmoji, closePopover } = props;

  const handleEmojiMouseEnter = (emojiCode: string, emojiName: string) => () => {
    setHoveredEmoji({ emojiCode, emojiName });
  };

  const handleEmojiMouseLeave = () => {
    setHoveredEmoji({ emojiCode: '', emojiName: '' });
  };

  const handleEmojiClick = (emojiCode: string) => () => {
    onClickEmoji(emojiCode);
    closePopover();
  };
  const emojiCode = elem.u
    .split('-')
    .map(hex => parseInt(hex, 16))
    .map(hex => String.fromCodePoint(hex))
    .join('');
  const emojiName = elem.n[0];
  return (
    <StyledListElem
      key={index}
      onMouseEnter={handleEmojiMouseEnter(emojiCode, emojiName)}
      onMouseLeave={handleEmojiMouseLeave}
      onClick={handleEmojiClick(emojiCode)}
    >
      {emojiCode}
    </StyledListElem>
  );
};

export { RenderEmoji };
