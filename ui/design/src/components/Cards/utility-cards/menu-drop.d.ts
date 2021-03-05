import * as React from 'react';
import { IMenuItem } from './filter-box';
export interface IMenuDrop {
  closeDrop: () => void;
  menuItems: IMenuItem[];
  target: any;
}
declare const MenuDrop: React.FC<IMenuDrop>;
export { MenuDrop };
