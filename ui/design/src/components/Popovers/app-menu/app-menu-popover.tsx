import { Box, Text } from 'grommet';
import * as React from 'react';
import { IApp } from '../../Bars/sidebar/sidebar';
import { IconLink } from '../../Buttons';
import { Icon } from '../../Icon/index';
import {
  StyledDrop,
  StyledOptionDiv,
  StyledOptionsBox,
  StyledTitleBox,
} from './styled-app-menu-popover';

export interface IAppMenuPopover {
  appData: IApp;
  target: HTMLDivElement;
  closePopover: () => void;
  onClickOption: (option: string) => void;
}

const AppMenuPopover: React.FC<IAppMenuPopover> = props => {
  const { appData, target, closePopover, onClickOption } = props;

  let aboutFlag = false;
  let settingsFlag = false;
  let notificationsFlag = false;

  const filteredAppData = appData.options.filter(option => {
    if (option.toLowerCase() === 'about') {
      aboutFlag = true;
      return false;
    }
    if (option.toLowerCase() === 'settings') {
      settingsFlag = true;
      return false;
    }
    if (option.toLowerCase() === 'notifications') {
      notificationsFlag = true;
      return false;
    }

    return true;
  });

  const handleOptionClick = (option: string) => () => {
    onClickOption(option);
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
        <Text weight="bold" truncate={true} title={appData.name}>
          {appData.name}
        </Text>
        <Box direction="row" gap="xsmall" align="center">
          {aboutFlag && <Icon type="info" clickable={true} onClick={handleOptionClick('About')} />}
          {settingsFlag && (
            <Icon type="settings" clickable={true} onClick={handleOptionClick('Settings')} />
          )}
          {notificationsFlag && (
            <Icon
              type="notifications"
              clickable={true}
              onClick={handleOptionClick('Notifications')}
            />
          )}
        </Box>
      </StyledTitleBox>
      <StyledOptionsBox direction="column" pad={{ horizontal: 'xsmall' }}>
        {filteredAppData.length > 0 &&
          filteredAppData.map((option, index) => (
            <StyledOptionDiv key={index}>
              <IconLink label={option} onClick={handleOptionClick(option)} />
            </StyledOptionDiv>
          ))}
      </StyledOptionsBox>
    </StyledDrop>
  );
};

export { AppMenuPopover };
