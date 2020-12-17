import { Box } from "grommet";
import React from "react";
import { StyledText } from "../../Buttons/default-buttons/styled-plain-button";
import { StyledDrop, StyledSelectBox } from "../entry-cards/styled-entry-box";

interface IProfileEditMenuProps {
  target: {};
  onClose: () => void;
  onUpdateClick: () => void;
  onENSChangeClick: () => void;
  updateProfileLabel: string;
  changeENSLabel: string;
  hideENSButton: boolean;
}

const ProfileEditMenuDropdown = (props: IProfileEditMenuProps) => {
  const { onClose, onENSChangeClick,  onUpdateClick } = props;
  return (
    <StyledDrop
      overflow="hidden"
      target={props.target}
      align={{ top: 'bottom', left: 'left' }}
      onClickOutside={onClose}
      onEsc={onClose}
      style={{ marginTop: '.5em' }}
    >
      <Box pad="xxsmall" width={{ min: '13rem' }}>
        <StyledSelectBox>
          <Box onClick={onUpdateClick}>
            <StyledText>{props.updateProfileLabel}</StyledText>
          </Box>
        </StyledSelectBox>
        {!props.hideENSButton &&
        <StyledSelectBox>
          <Box onClick={onENSChangeClick}>
            <StyledText>{props.changeENSLabel}</StyledText>
          </Box>
        </StyledSelectBox>
        }
      </Box>
    </StyledDrop>
  );
}

export default ProfileEditMenuDropdown;
