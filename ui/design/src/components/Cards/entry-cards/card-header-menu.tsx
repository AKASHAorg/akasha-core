import * as React from 'react';
import { StyledDrop, StyledSelectBox } from './styled-entry-box';
import { TextIcon } from '../../TextIcon';
import { Box } from 'grommet';

export interface ICardHeaderMenuProps {
  target: {};
  onMenuClose: () => void;
  editPostLabel: string;
  onFlag: () => void;
  copyLinkLabel: string;
  onLinkCopy: () => void;
}

const CardHeaderMenuDropdown: React.FC<ICardHeaderMenuProps> = props => {
  const { target, onMenuClose, editPostLabel, onFlag, copyLinkLabel, onLinkCopy } = props;
  return (
    <StyledDrop
      overflow="hidden"
      target={target}
      align={{ top: 'bottom', right: 'left' }}
      onClickOutside={onMenuClose}
      onEsc={onMenuClose}
    >
      <Box pad="small" gap="small" margin={{ right: 'small' }}>
        <StyledSelectBox>
          <TextIcon iconType="app" label={editPostLabel} onClick={onFlag} clickable={true} />
        </StyledSelectBox>
        <StyledSelectBox>
          <TextIcon iconType="link" label={copyLinkLabel} onClick={onLinkCopy} clickable={true} />
        </StyledSelectBox>
      </Box>
    </StyledDrop>
  );
};

export default CardHeaderMenuDropdown;
