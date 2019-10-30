import * as React from 'react';
import { StyledDrop } from './styled-drop';

interface IBasicPopover {
  children: any;
  closePopover: () => {};
  target: React.RefObject<any>;
  gap?: string;
}

const BasicPopover: React.FC<IBasicPopover> = ({ children, ...props }) => {
  const { target, closePopover, gap } = props;
  return (
    <StyledDrop
      overflow="hidden"
      gap={gap}
      target={target}
      align={{ top: 'bottom', right: 'left' }}
      onClickOutside={closePopover}
      onEsc={closePopover}
    >
      {children}
    </StyledDrop>
  );
};

export default BasicPopover;
