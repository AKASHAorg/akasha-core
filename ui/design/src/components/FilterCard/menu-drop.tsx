import * as React from 'react';
import { StyledDrop, StyledText } from './styled-filter-box';
import { IMenuItem } from './filter-box';
import { Box } from 'grommet';

export interface IMenuDrop {
  closeDrop: () => void;
  menuItems: IMenuItem[];
  target: any;
}

const MenuDrop: React.FC<IMenuDrop> = ({ closeDrop, menuItems, target }) => {
  const handleClick = (handler: any) => () => {
    handler();
    closeDrop();
  };
  return (
    <StyledDrop
      target={target}
      onClickOutside={closeDrop}
      onEsc={closeDrop}
      align={{ top: 'bottom', right: 'right' }}
    >
      <Box
        round="xxsmall"
        pad="xsmall"
        align="center"
        justify="start"
        gap="xsmall"
        border={{ style: 'solid', size: '1px', color: 'border', side: 'all' }}
      >
        {menuItems?.map((menuItem: IMenuItem, index: number) => (
          <Box onClick={handleClick(menuItem.handler)} key={index}>
            <StyledText>{menuItem.label}</StyledText>
          </Box>
        ))}
      </Box>
    </StyledDrop>
  );
};

export { MenuDrop };
