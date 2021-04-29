import * as React from 'react';
import { StyledDrop, StyledSelectBox } from './styled-entry-box';
import { TextIcon } from '../TextIcon';
import { Box, Text } from 'grommet';

export interface ICardHeaderAkashaProps {
  target: {};
  onMenuClose: () => void;
  CID: string;
  CIDLabel?: string;
}

const CardHeaderAkashaDropdown: React.FC<ICardHeaderAkashaProps> = props => {
  const { target, onMenuClose, CID, CIDLabel } = props;
  const onLinkCopy = () => {
    navigator.clipboard.writeText(CID);
  };
  return (
    <StyledDrop
      overflow="hidden"
      target={target}
      align={{ top: 'bottom', right: 'right' }}
      onClickOutside={onMenuClose}
      onEsc={onMenuClose}
    >
      <Box pad="xxsmall" width={{ min: '13rem', max: '15rem' }} align="center">
        <Text size="large" weight="bold" color="primaryText">
          {CIDLabel}
        </Text>
        <StyledSelectBox>
          <TextIcon
            iconType="copy"
            label={CID}
            onClick={onLinkCopy}
            clickable={true}
            iconSize="xs"
            fontSize="small"
          />
        </StyledSelectBox>
      </Box>
    </StyledDrop>
  );
};

CardHeaderAkashaDropdown.defaultProps = {
  CIDLabel: 'CID',
};

export default CardHeaderAkashaDropdown;
