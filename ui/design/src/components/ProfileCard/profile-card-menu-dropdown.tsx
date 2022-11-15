import { Box, ThemeContext } from 'grommet';
import React from 'react';
import styled from 'styled-components';
import { StyledText } from '../PlainButton/styled-plain-button';
import { StyledDrop, StyledSelectBox } from '../EntryCard/styled-entry-box';
import TextIcon from '../TextIcon';

interface IProfileEditMenuProps {
  target: HTMLDivElement;
  onClose: () => void;
  onBlockClick: () => void;
  onReportClick: () => void;
  flagAsLabel?: string;
  blockLabel?: string;
  hideENSButton?: boolean;
  flaggable?: boolean;
}

const MenuOption = styled(StyledSelectBox)`
  padding: 0.5em;
  &:hover {
    background: ${props => props.theme.colors.hoverBackground};
  }
`;

const ProfileMenuDropdown = (props: IProfileEditMenuProps) => {
  const { flaggable, onClose, onBlockClick, onReportClick } = props;

  const theme: any = React.useContext(ThemeContext);

  return (
    <StyledDrop
      overflow="hidden"
      target={props.target}
      align={{ top: 'bottom', right: 'right' }}
      onClickOutside={onClose}
      onEsc={onClose}
      style={{ padding: '0.65em 0.3em' }}
    >
      <Box pad="xxsmall" width="fit-content">
        {flaggable && (
          <>
            {props.blockLabel && (
              <MenuOption>
                <TextIcon
                  iconType="block"
                  label={props.blockLabel}
                  onClick={onBlockClick}
                  color={theme.colors.errorText}
                  iconSize="xs"
                  fontSize="medium"
                />
              </MenuOption>
            )}
            {props.flagAsLabel && (
              <MenuOption>
                <TextIcon
                  iconType="report"
                  label={props.flagAsLabel}
                  onClick={onReportClick}
                  color={theme.colors.errorText}
                  iconSize="xs"
                  fontSize="medium"
                />
              </MenuOption>
            )}
          </>
        )}
      </Box>
    </StyledDrop>
  );
};

export default ProfileMenuDropdown;
