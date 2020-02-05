import { Box, Text } from 'grommet';
import * as React from 'react';
import { IApp } from '../../Bars/sidebar/sidebar';
import { Icon } from '../../Icon/index';
import { StyledDrop } from './styled-app-menu-popover';

export interface IAppMenuPopover {
  appData: IApp;
  aboutLabel: string;
  feedLabel: string;
  collectionsLabel: string;
  target: HTMLDivElement;
  closePopover: () => void;
}

const AppMenuPopover: React.FC<IAppMenuPopover> = props => {
  const { appData, aboutLabel, feedLabel, collectionsLabel, target, closePopover } = props;
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
          <Box gap="xsmall" direction="row" align="center">
            <Icon type="app" />
            <Text>{aboutLabel}</Text>
          </Box>
          <Box gap="xsmall" direction="row" align="center">
            <Icon type="quote" />
            <Text>{feedLabel}</Text>
          </Box>
          <Box gap="xsmall" direction="row" align="center">
            <Icon type="bookmark" />
            <Text>{collectionsLabel}</Text>
          </Box>
        </Box>
      </Box>
    </StyledDrop>
  );
};

export { AppMenuPopover };
