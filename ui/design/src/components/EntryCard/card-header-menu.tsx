import * as React from 'react';
import { StyledDrop, StyledSelectBox } from './styled-entry-box';
import TextIcon from '../TextIcon';
import { Box, ThemeContext } from 'grommet';
import { IconType } from '../Icon';

export interface ICardHeaderMenuProps {
  target: HTMLDivElement;
  onMenuClose: () => void;
  menuItems: ({ icon: IconType; label: string; handler: () => void } | null)[];
}

const CardHeaderMenuDropdown: React.FC<ICardHeaderMenuProps> = props => {
  const { target, onMenuClose, menuItems } = props;

  const theme: any = React.useContext(ThemeContext);

  const handleClick = (handler: () => void) => () => {
    // hide menu dropdown when clicked
    handler();
    return onMenuClose();
  };

  return (
    <StyledDrop
      overflow="hidden"
      target={target}
      align={{ top: 'bottom', right: 'right' }}
      onClickOutside={onMenuClose}
      onEsc={onMenuClose}
    >
      <Box pad="xxsmall">
        {menuItems.map((menuItem, idx) => {
          if (!menuItem) {
            return null;
          }
          return (
            <StyledSelectBox key={`${menuItem.label}-${idx}`}>
              <TextIcon
                iconType={menuItem.icon}
                label={menuItem.label}
                onClick={handleClick(menuItem.handler)}
                color={theme.colors.errorText}
                iconSize="xs"
                fontSize="medium"
              />
            </StyledSelectBox>
          );
        })}
      </Box>
    </StyledDrop>
  );
};

export default CardHeaderMenuDropdown;
