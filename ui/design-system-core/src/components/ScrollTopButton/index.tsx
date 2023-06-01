import * as React from 'react';
import { tw, apply } from '@twind/core';
import Icon from '../Icon';

export type ScrollTopButtonProps = {
  onClick: () => void;
  hide?: boolean;
};

const ScrollTopButton = React.forwardRef<HTMLDivElement, ScrollTopButtonProps>(
  ({ onClick, hide }, ref) => {
    const styledDiv = apply`
    flex items-center justify-center
    w-[48px] h-[48px]
    rounded-3xl
    bg-[#DCE3FF]
    cursor-pointer
    hover:(bg-[#4666E6] [&>*]:stroke-[#fff])
    `;

    return (
      !hide && (
        <div ref={ref} onClick={() => onClick()} className={tw(styledDiv)}>
          <Icon type="ArrowUpIcon" hover={true} accentColor={true} />
        </div>
      )
    );
  },
);

export default ScrollTopButton;
