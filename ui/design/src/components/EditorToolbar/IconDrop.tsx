import React from 'react';

import Icon from '../Icon';
import { StyledDrop, StyledSelectBox } from '../EntryCard/styled-entry-box';

type IconEntry = {
  type: string;
  handler: () => void;
};

export interface IIconDropProps {
  target: HTMLDivElement;
  dropItems: IconEntry[];
  onMenuClose: () => void;
}

const IconDrop: React.FC<IIconDropProps> = props => {
  const { target, dropItems, onMenuClose } = props;
  return (
    <StyledDrop
      overflow="hidden"
      target={target}
      align={{ top: 'bottom', right: 'right' }}
      onClickOutside={onMenuClose}
      onEsc={onMenuClose}
    >
      {dropItems.map((icon, idx) => (
        <StyledSelectBox key={`${icon.type}-${idx}`} align="center" onClick={icon.handler}>
          <Icon type={icon.type} size="sm" plain={true} />
        </StyledSelectBox>
      ))}
    </StyledDrop>
  );
};

export default IconDrop;
