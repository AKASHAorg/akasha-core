import * as React from 'react';
import { StyledDrop, StyledSelectBox } from './styled-entry-box';
import TextIcon from '../TextIcon';
import { Box, ThemeContext } from 'grommet';

export interface ICardHeaderMenuProps {
  target: {};
  onMenuClose: () => void;
  flagAsLabel?: string;
  onFlag: () => void;
}

const CardHeaderMenuDropdown: React.FC<ICardHeaderMenuProps> = props => {
  const { target, onMenuClose, flagAsLabel, onFlag } = props;

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
        <StyledSelectBox>
          <TextIcon
            iconType="report"
            label={flagAsLabel}
            onClick={handleClick(onFlag)}
            color={theme.colors.errorText}
            iconSize="xs"
            fontSize="medium"
          />
        </StyledSelectBox>
      </Box>
    </StyledDrop>
  );
};

export default CardHeaderMenuDropdown;
