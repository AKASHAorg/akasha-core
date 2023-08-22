import * as React from 'react';

import Icon from '../Icon';
import Button from '../Button';

export type ScrollTopButtonProps = {
  onClick: () => void;
  hide?: boolean;
};

const ScrollTopButton = React.forwardRef<HTMLDivElement, ScrollTopButtonProps>(
  ({ onClick, hide }, ref) => {
    const styledDiv =
      'flex items-center justify-center w-[48px] h-[48px] rounded-3xl bg-[#DCE3FF] cursor-pointer hover:(bg-[#4666E6] [&>*]:stroke-[#fff])';

    return (
      !hide && (
        <Button
          title="scroll-to-top"
          plain={true}
          onClick={() => onClick()}
          customStyle={styledDiv}
        >
          <div ref={ref}>
            <Icon type="ArrowUpIcon" hover={true} accentColor={true} />
          </div>
        </Button>
      )
    );
  },
);

export default ScrollTopButton;
