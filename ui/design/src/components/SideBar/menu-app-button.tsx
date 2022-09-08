import * as React from 'react';
import {
  IntegrationTypes,
  LogoTypeSource,
  IMenuItem,
  MenuItemAreaType,
} from '@akashaorg/typings/ui';

import { AppIcon } from '../Icon/app-icon';
import AppAvatar from '../AppAvatar';

import { StyledAppIconWrapper } from './styled-sidebar';

export interface IMenuAppButton {
  plain?: boolean;
  menuItem: IMenuItem;
  accentColor?: boolean;
  hasNewNotifs?: boolean;
  onClick?: React.EventHandler<React.SyntheticEvent>;
}

const MenuAppButton: React.FC<IMenuAppButton> = props => {
  const { plain, menuItem, accentColor, hasNewNotifs, onClick } = props;

  const renderItem = () => {
    // uncomment this to enable app avatars for user installed apps

    // if (menuItem.area?.includes(MenuItemAreaType.UserAppArea)) {
    //   return (
    //     <AppAvatar
    //       size="md"
    //       // edge-case for test app: ignore icons, even if specified, use only avatars
    //       src={{ url: menuItem.logo.type !== LogoTypeSource.ICON ? menuItem.logo.value : null }}
    //       backgroundColor="transparent"
    //       appType={AppTypes.APP}
    //     />
    //   );
    // }

    if (menuItem.area?.includes(MenuItemAreaType.UserWidgetArea)) {
      return (
        <AppAvatar
          size="md"
          src={{ url: menuItem.logo.type !== LogoTypeSource.ICON ? menuItem.logo.value : null }}
          backgroundColor="transparent"
          appType={IntegrationTypes.WIDGET}
        />
      );
    }
    return (
      <AppIcon
        size="sm"
        plain={plain}
        onClick={onClick}
        appImg={menuItem.logo}
        accentColor={accentColor}
        stackedIcon={hasNewNotifs}
        hasNewNotifs={hasNewNotifs}
        placeholderIconType="app"
        backgroundColor="transparent"
      />
    );
  };
  return <StyledAppIconWrapper backgroundColor="transparent">{renderItem()}</StyledAppIconWrapper>;
};

export { MenuAppButton };
