import React, { PropsWithChildren } from 'react';
import { tw, apply } from '@twind/core';

export type ScrollTopWrapperProps = {
  placement?: React.CSSProperties['marginLeft'];
};

/**
 * The ScrollTopWrapper component is, as its name implies, a wrapper around the ScrollTopButton component.
 * This component determines the position of the ScrollTopButton on a page.
 * @param placement -  (optional) customize the `marginLeft` CSS property of the placement of the button
 * @example
 * ```tsx
 *   <ScrollTopWrapper placement={scrollTopButtonPlacement}>
        <ScrollTopButton hide={false} onClick={onScrollToTop} />
     </ScrollTopWrapper>
 * ```
 **/
const ScrollTopWrapper: React.FC<PropsWithChildren<ScrollTopWrapperProps>> = ({
  placement,
  children,
}) => {
  return (
    <div className={tw(apply(`fixed bottom-[20px] z-10 ${placement && `ml-[${placement}]`}`))}>
      {children}
    </div>
  );
};

export default ScrollTopWrapper;
