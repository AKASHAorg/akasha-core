import * as React from 'react';
import { StyledDrop, StyledSelectBox } from './styled-entry-box';
import { TextIcon } from '../../TextIcon';
import { Box } from 'grommet';

export interface ICardHeaderMenuProps {
  target: {};
  onMenuClose: () => void;
  flagAsLabel: string;
  onFlag: () => void;
  copyIPFSLinkLabel: string;
  onLinkCopy: (linkType: 'ipfs' | 'shareable') => () => void;
}

const CardHeaderMenuDropdown: React.FC<ICardHeaderMenuProps> = props => {
  const { target, onMenuClose, flagAsLabel, onFlag, copyIPFSLinkLabel, onLinkCopy } = props;
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
          <TextIcon
            iconType="link"
            label={copyIPFSLinkLabel}
            onClick={onLinkCopy('ipfs')}
            clickable={true}
          />
        </StyledSelectBox>
        <StyledSelectBox>
          <TextIcon iconType="app" label={flagAsLabel} onClick={onFlag} clickable={true} />
        </StyledSelectBox>
      </Box>
    </StyledDrop>
  );
};

export default CardHeaderMenuDropdown;
