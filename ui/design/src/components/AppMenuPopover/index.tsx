import { Box, Text } from 'grommet';
import * as React from 'react';
import { IMenuItem } from '@akashaproject/ui-awf-typings/lib/app-loader';

import Icon from '../Icon';
import IconLink from '../IconLink';
import {
  StyledDrop,
  StyledOptionDiv,
  StyledOptionsBox,
  StyledTitleBox,
} from './styled-app-menu-popover';

export interface IAppMenuPopover {
  menuItem: IMenuItem;
  target: HTMLDivElement;
  closePopover: () => void;
  onClickMenuItem: (subRoute: string) => void;
}

const AppMenuPopover: React.FC<IAppMenuPopover> = props => {
  const { menuItem, target, closePopover, onClickMenuItem } = props;

  let aboutFlag = false;
  let settingsFlag = false;
  let notificationsFlag = false;

  const filteredAppData =
    menuItem.subRoutes &&
    menuItem.subRoutes.filter(subRoute => {
      if (subRoute.label.toLowerCase() === 'about') {
        aboutFlag = true;
        return false;
      }
      if (subRoute.label.toLowerCase() === 'settings') {
        settingsFlag = true;
        return false;
      }
      if (subRoute.label.toLowerCase() === 'notifications') {
        notificationsFlag = true;
        return false;
      }

      return true;
    });

  const handleClickSubroute = (subRoute: string) => () => {
    onClickMenuItem(subRoute);
    closePopover();
  };
  return (
    <StyledDrop
      target={target}
      onEsc={closePopover}
      onClickOutside={closePopover}
      align={{ top: 'top', left: 'right' }}
    >
      <StyledTitleBox
        direction="row"
        justify="between"
        align="center"
        pad={{ horizontal: 'xsmall' }}
      >
        <Text weight="bold" truncate={true} title={menuItem.label}>
          {menuItem.label}
        </Text>
        <Box direction="row" gap="xsmall" align="center">
          {aboutFlag && (
            <Icon type="info" clickable={true} onClick={handleClickSubroute('About')} />
          )}
          {settingsFlag && (
            <Icon type="settings" clickable={true} onClick={handleClickSubroute('Settings')} />
          )}
          {notificationsFlag && (
            <Icon
              type="notifications"
              clickable={true}
              onClick={handleClickSubroute('Notifications')}
            />
          )}
        </Box>
      </StyledTitleBox>
      <StyledOptionsBox direction="column" pad={{ horizontal: 'xsmall' }}>
        {filteredAppData &&
          filteredAppData.length > 0 &&
          filteredAppData.map((subRoute, index) => (
            <StyledOptionDiv key={index}>
              <IconLink label={subRoute.label} onClick={handleClickSubroute(subRoute.route)} />
            </StyledOptionDiv>
          ))}
      </StyledOptionsBox>
    </StyledDrop>
  );
};

export default AppMenuPopover;
