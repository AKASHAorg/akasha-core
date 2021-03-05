import * as React from 'react';
export interface ISearchInput {
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  handleCancel: React.EventHandler<React.SyntheticEvent>;
  inputValue: string;
  placeholderLabel?: string;
  cancelLabel?: string;
}
declare const SearchInput: React.FC<ISearchInput>;
export default SearchInput;
