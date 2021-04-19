import * as React from 'react';
import { StyledAppIconWrapper } from './styled-sidebar';
import { AppIcon } from '../Icon/index';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';

export interface IMenuAppButton {
  active: boolean;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  menuItem: IMenuItem;
}

const MenuAppButton: React.FC<IMenuAppButton> = props => {
  const { active, onClick, menuItem } = props;
  const renderItem = () => {
    return <AppIcon placeholderIconType="app" appImg={menuItem.logo} onClick={onClick} size="md" />;
  };
  return <StyledAppIconWrapper active={active}>{renderItem()}</StyledAppIconWrapper>;
};

export { MenuAppButton };
