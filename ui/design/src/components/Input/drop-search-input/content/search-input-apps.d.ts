import * as React from 'react';
export interface ISearchInputAppsProps {
  apps: any[];
  onClickApp: (name: string) => void;
}
declare const SearchInputApps: React.FC<ISearchInputAppsProps>;
export default SearchInputApps;
