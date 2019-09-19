import PopoverBase from '@trendmicro/react-popover';
import React from 'react';
import { StyledBasePopover } from './styled-base-popover';

export interface PopoverProps {
  children?: string | React.ReactNode;
  show?: boolean;
  placement?:
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'right'
    | 'right-top'
    | 'right-bottom'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right'
    | 'left'
    | 'left-top'
    | 'left-bottom';
  target?: Element | null;
  togglePopover?: Function;
}

export interface PopoverFC<T> extends React.FC<T> {
  Header: React.FC<T>;
  Body: React.FC<T>;
  Footer: React.FC<T>;
}

const Popover: PopoverFC<PopoverProps> = (props: PopoverProps) => <StyledBasePopover {...props} />;
Popover.Header = props => <PopoverBase.Header {...props} />;
Popover.Body = props => <PopoverBase.Body {...props} />;
Popover.Footer = props => <PopoverBase.Footer {...props} />;

Popover.defaultProps = {
  children: '',
  show: false,
  placement: 'bottom-right',
  target: null,
};

export default Popover;
