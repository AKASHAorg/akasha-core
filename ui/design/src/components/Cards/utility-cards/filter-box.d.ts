import * as React from 'react';
export interface IFilterBox {
  currentlySeeingLabel?: string;
  sortByLabel?: string;
  allLabel?: string;
  followingLabel?: string;
  latestLabel?: string;
  oldestLabel?: string;
  handleClickAll: () => void;
  handleClickFollowing: () => void;
  handleClickLatest: () => void;
  handleClickOldest: () => void;
}
export interface IMenuItem {
  label?: string;
  handler?: () => void;
}
declare const FilterBox: React.FC<IFilterBox>;
export { FilterBox };
