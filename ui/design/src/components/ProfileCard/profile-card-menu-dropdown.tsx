import { Box, ThemeContext } from 'grommet';
import React from 'react';
import styled from 'styled-components';
import { StyledText } from '../PlainButton/styled-plain-button';
import { StyledDrop, StyledSelectBox } from '../EntryCard/styled-entry-box';
import TextIcon from '../TextIcon';

interface IProfileEditMenuProps {
  target: HTMLDivElement;
  onClose: () => void;
  onReportClick: () => void;
  onUpdateClick: () => void;
  onENSChangeClick: () => void;
  flagAsLabel?: string;
  updateProfileLabel?: string;
  changeENSLabel?: string;
  hideENSButton?: boolean;
  flaggable?: boolean;
}

const MenuOption = styled(StyledSelectBox)`
  padding: 0.5em;
  &:hover {
    background: transparent;
  }
`;

const ProfileMenuDropdown = (props: IProfileEditMenuProps) => {
  const { flaggable, onClose, onENSChangeClick, onReportClick, onUpdateClick } = props;

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
      <Box pad="xxsmall" width={{ min: '13rem' }}>
        {flaggable && (
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
        {!flaggable && (
          <>
            <MenuOption>
              <Box onClick={onUpdateClick}>
                <StyledText>{props.updateProfileLabel}</StyledText>
              </Box>
            </MenuOption>
            {!props.hideENSButton && (
              <MenuOption>
                <Box onClick={onENSChangeClick}>
                  <StyledText>{props.changeENSLabel}</StyledText>
                </Box>
              </MenuOption>
            )}
          </>
        )}
      </Box>
    </StyledDrop>
  );
};

export default ProfileMenuDropdown;
