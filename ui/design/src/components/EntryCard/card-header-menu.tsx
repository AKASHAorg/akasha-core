import * as React from 'react';
import { StyledDrop, StyledSelectBox } from './styled-entry-box';
import TextIcon from '../TextIcon';
import { Box, ThemeContext } from 'grommet';
import { IconType } from '../Icon';
import { IMenuItem } from '../MobileListModal';

export interface ICardHeaderMenuProps {
  target: HTMLDivElement;
  onMenuClose: () => void;
  menuItems: (IMenuItem | null)[];
  headerMenuExt?: React.ReactElement;
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
      <Box pad="xxsmall" onClick={onMenuClose}>
        {!!props.headerMenuExt &&
          React.cloneElement(props.headerMenuExt, { onWrapperClick: onMenuClose })}
        {menuItems.map((menuItem, idx) => {
          if (!menuItem) {
            return null;
          }
          return (
            <StyledSelectBox key={`${menuItem.label}-${idx}`}>
              <TextIcon
                iconType={menuItem.icon as IconType}
                label={menuItem.label}
                onClick={handleClick(menuItem.handler)}
                color={theme.colors.errorText}
                iconSize="xs"
                fontSize="medium"
                disabled={menuItem.disabled}
              />
            </StyledSelectBox>
          );
        })}
      </Box>
    </StyledDrop>
  );
};

export default CardHeaderMenuDropdown;
