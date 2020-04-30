import * as React from 'react';
import { StyledAppIconWrapper, StyledBorderBox, StyledVerticalPad } from './styled-sidebar';
import { Avatar } from '../../Avatar/index';
import { AppIcon } from '../../Icon/index';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { LogoTypeSource } from '@akashaproject/ui-awf-typings/lib';

export interface IMenuAppButton {
  active: boolean;
  loggedEthAddress: string;
  avatarImage?: string;
  onClick: React.EventHandler<React.SyntheticEvent>;
  menuItem: IMenuItem;
}

const MenuAppButton: React.FC<IMenuAppButton> = props => {
  const { active, loggedEthAddress, avatarImage, onClick, menuItem } = props;
  const renderItem = () => {
    if (menuItem.logo?.type === LogoTypeSource.AVATAR) {
      return <Avatar ethAddress={loggedEthAddress} src={avatarImage} size="sm" onClick={onClick} />;
    }
    return <AppIcon placeholderIconType="app" appImg={menuItem.logo} onClick={onClick} size="md" />;
  };
  return (
    <StyledVerticalPad>
      <StyledBorderBox fill="horizontal" align="center" userSection={true} active={active}>
        <StyledAppIconWrapper active={active}>{renderItem()}</StyledAppIconWrapper>
      </StyledBorderBox>
    </StyledVerticalPad>
  );
};

export { MenuAppButton };
