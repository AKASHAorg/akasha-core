import * as React from 'react';
import { AppTypes, LogoTypeSource } from '@akashaproject/ui-awf-typings';
import { IMenuItem, MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';

import { AppIcon } from '../Icon/app-icon';
import AppAvatar from '../AppAvatar';

import { StyledAppIconWrapper } from './styled-sidebar';

export interface IMenuAppButton {
  plain?: boolean;
  menuItem: IMenuItem;
  accentColor?: boolean;
  onClick?: React.EventHandler<React.SyntheticEvent>;
}

const MenuAppButton: React.FC<IMenuAppButton> = props => {
  const { plain, menuItem, accentColor, onClick } = props;

  const renderItem = () => {
    if (menuItem.area?.includes(MenuItemAreaType.UserAppArea)) {
      return (
        <AppAvatar
          size="md"
          // edge-case for test app: ignore icons, even if specified, use only avatars
          src={menuItem.logo.type !== LogoTypeSource.ICON ? menuItem.logo.value : null}
          backgroundColor="transparent"
          appType={AppTypes.APP}
        />
      );
    }
    if (menuItem.area?.includes(MenuItemAreaType.UserWidgetArea)) {
      return (
        <AppAvatar
          size="md"
          src={menuItem.logo.type !== LogoTypeSource.ICON ? menuItem.logo.value : null}
          backgroundColor="transparent"
          appType={AppTypes.WIDGET}
        />
      );
    }
    return (
      <AppIcon
        size="md"
        plain={plain}
        onClick={onClick}
        appImg={menuItem.logo}
        accentColor={accentColor}
        placeholderIconType="app"
        backgroundColor="transparent"
      />
    );
  };
  return <StyledAppIconWrapper backgroundColor="transparent">{renderItem()}</StyledAppIconWrapper>;
};

export { MenuAppButton };
