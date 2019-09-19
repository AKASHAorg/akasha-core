import PopoverBase from '@trendmicro/react-popover';
import React, { useRef } from 'react';
import { PopoverFC, PopoverProps } from './BasePopover';
import List, { ListProps } from '../List';
import { StyledListPopover, StyledListPopoverBody } from './styled-list-popover';
import useSimpleClickAway from '../../utils/simpleClickAway';
// import { useOnClickAway } from '../../utils/clickAway'

const Popover: PopoverFC<PopoverProps> = (props: PopoverProps) => <StyledListPopover {...props} />;
Popover.Header = props => <PopoverBase.Header {...props} />;
Popover.Body = props => <StyledListPopoverBody {...props} />;
Popover.Footer = props => <PopoverBase.Footer {...props} />;

// tslint:disable-next-line:no-empty-interface
export interface ListPopoverProps extends ListProps, PopoverProps {}

const ListPopover: React.FC<ListPopoverProps> = ({
  show,
  placement,
  target,
  dataSource,
  renderItem,
  togglePopover,
}: ListPopoverProps) => {
  const wrapperRef = useRef(null);
  useSimpleClickAway(wrapperRef, togglePopover);
  // useOnClickAway(wrapperRef, togglePopover);
  return (
    <div ref={wrapperRef}>
      <Popover show={show} placement={placement} target={target} togglePopover={togglePopover}>
        <Popover.Body>
          <List dataSource={dataSource} renderItem={renderItem} />
        </Popover.Body>
      </Popover>
    </div>
  );
};

export default ListPopover;
