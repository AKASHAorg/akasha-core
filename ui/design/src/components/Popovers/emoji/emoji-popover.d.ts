import * as React from 'react';
export interface IEmojiPopover {
  className?: string;
  onClickEmoji: (emojiCode: string) => void;
  target: HTMLElement;
  closePopover: () => void;
}
export interface IEmojiData {
  n: string[];
  u: string;
  v?: string[];
}
declare const EmojiPopover: React.FC<IEmojiPopover>;
export { EmojiPopover };
