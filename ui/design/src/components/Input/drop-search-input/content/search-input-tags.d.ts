import * as React from 'react';
export interface ISearchInputTagsProps {
  tags: any[];
  onClickTag: (tag: string) => void;
}
declare const SearchInputTags: React.FC<ISearchInputTagsProps>;
export default SearchInputTags;
