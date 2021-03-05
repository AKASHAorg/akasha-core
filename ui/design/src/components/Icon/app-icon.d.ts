import * as React from 'react';
import { IconType } from './icon';
import { LogoSourceType } from '@akashaproject/ui-awf-typings';
export interface IAppIcon extends IconSize {
  ref?: React.Ref<HTMLDivElement>;
  appImg?: LogoSourceType;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  placeholderIconType: IconType;
}
export interface IconSize {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}
declare const AppIcon: React.FC<IAppIcon>;
export { AppIcon };
