import * as React from 'react';
import { StyledAppIconWrapper } from './styled-sidebar';
import { AppIcon } from '../Icon/app-icon';
import { IMenuItem, MenuItemAreaType } from '@akashaproject/ui-awf-typings/lib/app-loader';
import AppAvatar from '../AppAvatar';

export interface IMenuAppButton {
  active: boolean;
  plain?: boolean;
  menuItem: IMenuItem;
  onClick?: React.EventHandler<React.SyntheticEvent>;
}

const MenuAppButton: React.FC<IMenuAppButton> = props => {
  const { active, plain, menuItem, onClick } = props;
  const renderItem = () => {
    if (menuItem.area === MenuItemAreaType.UserAppArea) {
      return (
        <AppAvatar
          src={menuItem.logo.value}
          sidebarApp={!menuItem.logo.value || menuItem.logo.value.length < 1}
        />
      );
    }
    if (menuItem.area === MenuItemAreaType.UserWidgetArea) {
      return (
        <AppAvatar
          src={menuItem.logo.value}
          sidebarWidget={!menuItem.logo.value || menuItem.logo.value.length < 1}
        />
      );
    }
    return (
      <AppIcon
        placeholderIconType="app"
        plain={plain}
        appImg={menuItem.logo}
        onClick={onClick}
        size="md"
      />
    );
  };
  return <StyledAppIconWrapper active={active}>{renderItem()}</StyledAppIconWrapper>;
};

export { MenuAppButton };
