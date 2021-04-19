import { Box } from 'grommet';
import React from 'react';
import styled from 'styled-components';
import { StyledText } from '../../PlainButton/styled-plain-button';
import { StyledDrop, StyledSelectBox } from '../entry-cards/styled-entry-box';

interface IProfileEditMenuProps {
  target: {};
  onClose: () => void;
  onUpdateClick: () => void;
  onENSChangeClick: () => void;
  updateProfileLabel?: string;
  changeENSLabel?: string;
  hideENSButton?: boolean;
}

const MenuOption = styled(StyledSelectBox)`
  padding: 0.5em;
  &:hover {
    background: transparent;
  }
`;

const ProfileEditMenuDropdown = (props: IProfileEditMenuProps) => {
  const { onClose, onENSChangeClick, onUpdateClick } = props;
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
      </Box>
    </StyledDrop>
  );
};

export default ProfileEditMenuDropdown;
