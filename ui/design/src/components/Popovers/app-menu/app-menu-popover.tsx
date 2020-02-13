import { Box, Text } from 'grommet';
import * as React from 'react';
import { IApp } from '../../Bars/sidebar/sidebar';
import { IconLink } from '../../Buttons';
import { Icon } from '../../Icon/index';
import { StyledDrop } from './styled-app-menu-popover';

export interface IAppMenuPopover {
  appData: IApp;
  target: HTMLDivElement;
  closePopover: () => void;
  onClickOption: (option: string) => void;
}

const AppMenuPopover: React.FC<IAppMenuPopover> = props => {
  const { appData, target, closePopover, onClickOption } = props;
  console.log(appData);

  const handleOptionClick = (option: string) => () => {
    onClickOption(option);
    closePopover();
  };
  return (
    <StyledDrop
      target={target}
      onEsc={closePopover}
      onClickOutside={closePopover}
      align={{ top: 'top', left: 'left' }}
    >
      <Box pad="xsmall">
        <Box direction="row" justify="between" align="center">
          <Text weight="bold">{appData.name}</Text>
          <Box direction="row" gap="xsmall">
            <Icon type="settings" clickable={true} />
            <Icon type="notifications" clickable={true} />
          </Box>
        </Box>
        <Box direction="column" gap="xsmall">
          {appData.options.map((option, index) => (
            <IconLink key={index} label={option} onClick={handleOptionClick(option)} />
          ))}
        </Box>
      </Box>
    </StyledDrop>
  );
};

export { AppMenuPopover };
