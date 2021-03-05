import * as React from 'react';
export interface ISearchInputUsersProps {
  users: any[];
  onClickUser: (name: string) => void;
}
declare const SearchInputUsers: React.FC<ISearchInputUsersProps>;
export default SearchInputUsers;
