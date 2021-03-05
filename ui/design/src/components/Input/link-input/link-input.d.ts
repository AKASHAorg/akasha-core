import * as React from 'react';
export interface ILinkInput {
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearInput: () => void;
  className?: string;
  inputValue: string;
}
declare const LinkInput: React.FC<ILinkInput>;
export default LinkInput;
