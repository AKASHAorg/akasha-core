import * as React from 'react';
import { StyledDrop, StyledSelectBox } from './styled-entry-box';
import { TextIcon } from '../../TextIcon';
import { Box } from 'grommet';

export interface ICardHeaderMenuProps {
  target: {};
  onMenuClose: () => void;
  flagAsLabel: string;
  onFlag: () => void;
  copyIPFSLinkLabel?: string;
  onLinkCopy?: (linkType: 'ipfs' | 'shareable') => () => void;
}

const CardHeaderMenuDropdown: React.FC<ICardHeaderMenuProps> = props => {
  const { target, onMenuClose, flagAsLabel, onFlag, copyIPFSLinkLabel, onLinkCopy } = props;

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
      <Box pad="xxsmall" width={{ min: '13rem' }}>
        {onLinkCopy && (
          <StyledSelectBox>
            <TextIcon
              iconType="appIpfs"
              label={copyIPFSLinkLabel}
              onClick={handleClick(onLinkCopy('ipfs'))}
              clickable={true}
              iconSize="xs"
              fontSize="small"
            />
          </StyledSelectBox>
        )}
        <StyledSelectBox>
          <TextIcon
            iconType="report"
            label={flagAsLabel}
            onClick={handleClick(onFlag)}
            color={'red'}
            iconSize="xs"
            fontSize="small"
          />
        </StyledSelectBox>
      </Box>
    </StyledDrop>
  );
};

export default CardHeaderMenuDropdown;
