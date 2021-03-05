import * as React from 'react';
export interface ILinkInput {
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputValue: string;
  onClick: React.EventHandler<React.SyntheticEvent>;
}
declare const LinkInput: React.FC<ILinkInput>;
export default LinkInput;
