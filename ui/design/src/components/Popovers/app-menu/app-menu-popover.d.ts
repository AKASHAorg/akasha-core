import * as React from 'react';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
export interface IAppMenuPopover {
  menuItem: IMenuItem;
  target: HTMLDivElement;
  closePopover: () => void;
  onClickMenuItem: (subRoute: string) => void;
}
declare const AppMenuPopover: React.FC<IAppMenuPopover>;
export { AppMenuPopover };
