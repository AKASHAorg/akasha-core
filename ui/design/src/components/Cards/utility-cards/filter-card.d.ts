import * as React from 'react';
import { IFilterBox } from './filter-box';
export interface IFilterCard extends IFilterBox {
  filtersLabel?: string;
  closeLabel?: string;
  titleElement: React.ReactElement;
  className?: string;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
}
declare const FilterCard: React.FC<IFilterCard>;
export { FilterCard };
