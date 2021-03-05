import React from 'react';
export interface ICustomSearchInput {
  className?: string;
  getData: () => void;
  dataSource: any;
  placeholder: string;
  resultsLabel: string;
  usersLabel: string;
  tagsLabel: string;
  appsLabel: string;
  onClickUser: (name: string) => void;
  onClickTag: (tag: string) => void;
  onClickApp: (name: string) => void;
}
declare const DropSearchInput: React.FC<ICustomSearchInput>;
export default DropSearchInput;
