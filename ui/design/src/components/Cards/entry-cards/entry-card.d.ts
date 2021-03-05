import * as React from 'react';
import { IEntryBoxProps } from './entry-box';
export interface IEntryCardProps extends IEntryBoxProps {
  repostedThisLabel?: string;
  andLabel?: string;
  othersLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
  contentClickable?: boolean;
}
declare const EntryCard: React.FC<IEntryCardProps>;
export { EntryCard };
