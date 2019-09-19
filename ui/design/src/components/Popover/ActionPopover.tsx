import PopoverBase from '@trendmicro/react-popover';
import React from 'react';
import { PopoverFC, PopoverProps } from './BasePopover';
import {
  StyledActionPopover,
  StyledActionPopoverBody,
  StyledActionPopoverFooter,
} from './styled-action-popover';
import Button from '../Button';

const Popover: PopoverFC<PopoverProps> = (props: PopoverProps) => (
  <StyledActionPopover {...props} />
);
Popover.Header = props => <PopoverBase.Header {...props} />;
Popover.Body = props => <StyledActionPopoverBody {...props} />;
Popover.Footer = props => <StyledActionPopoverFooter {...props} />;

// tslint:disable-next-line:no-empty-interface
export interface ActionPopoverProps extends PopoverProps {
  content: any;
  createText: any;
  onCancelClick: React.EventHandler<React.SyntheticEvent>;
  onOkClick: React.EventHandler<React.SyntheticEvent>;
}

const ListPopover: React.FC<ActionPopoverProps> = ({
  show,
  placement,
  target,
  content,
  createText,
  onCancelClick,
  onOkClick,
}: ActionPopoverProps) => {
  return (
    <Popover show={show} placement={placement} target={target}>
      <Popover.Body>{content}</Popover.Body>
      <Popover.Footer>
        <Button buttonType="regular" ghost onClick={onCancelClick}>
          Cancel
        </Button>
        <Button buttonType="primary" onClick={onOkClick}>
          {createText}
        </Button>
      </Popover.Footer>
    </Popover>
  );
};

export default ListPopover;
