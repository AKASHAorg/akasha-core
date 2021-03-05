import * as React from 'react';
import { IProfileDataProvider } from '../../Cards/profile-cards/profile-card';
export interface ISelectPopover {
  className?: string;
  onClickElem: (provider: IProfileDataProvider) => void;
  dataSource: IProfileDataProvider[];
  target: HTMLElement;
  closePopover: () => void;
  currentValue?: string;
}
declare const SelectPopover: React.FC<ISelectPopover>;
export { SelectPopover };
