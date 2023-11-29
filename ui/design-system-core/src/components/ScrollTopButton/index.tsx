import * as React from 'react';

import Icon from '../Icon';
import { ArrowUpIcon } from '../Icon/hero-icons-outline';
import Button from '../Button';

export type ScrollTopButtonProps = {
  onClick: () => void;
  hide?: boolean;
};

const ScrollTopButton = React.forwardRef<HTMLDivElement, ScrollTopButtonProps>(
  ({ onClick, hide }, ref) => {
    //@TODO: fix style
    const styledDiv = `flex items-center justify-center w-12 h-12 rounded-3xl bg-grey6 cursor-pointer hover:(bg-grey4 [&>*]:stroke-[#fff])`;

    return (
      !hide && (
        <Button
          title="scroll-to-top"
          plain={true}
          onClick={() => onClick()}
          customStyle={styledDiv}
        >
          <div ref={ref}>
            <Icon icon={<ArrowUpIcon />} hover={true} accentColor={true} />
          </div>
        </Button>
      )
    );
  },
);

export default ScrollTopButton;
