import * as React from 'react';

import Icon from '../Icon';
import { ArrowUpIcon } from '../Icon/hero-icons-outline';
import Button from '../Button';

export type ScrollTopButtonProps = {
  onClick: () => void;
  hide?: boolean;
};

/**
 * A ScrollTopButton component is often displayed at the bottom of a long page with lots of content. It
 * provides a quick way for users to navigate back to the top of the page without excessive scrolling.
 * @param hide - boolean (optional) whether to show or hide the button
 * @param onClick - handler that will be called when the user clicks on the button
 * @example
 * ```tsx
 *    <ScrollTopButton hide={false} onClick={onScrollToTop} />
 * ```
 **/
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
