import React from 'react';

export type UseScrollTopProps = {
  rootElementRef: React.RefObject<HTMLElement>;
  topbarHeight: number;
  itemSpacing: number;
  languageDirection: 'ltr' | 'rtl';
};
export const useScrollTop = (props: UseScrollTopProps) => {
  const { rootElementRef, topbarHeight, itemSpacing, languageDirection } = props;
  const [hideScrollTop, setHideScrollTop] = React.useState(true);
  /**
   * Handle scroll to top button visibility
   */
  React.useLayoutEffect(() => {
    const onScroll = () => {
      if (!rootElementRef.current) {
        return;
      }
      if (window.scrollY > rootElementRef.current.offsetTop + topbarHeight + itemSpacing * 2) {
        return setHideScrollTop(false);
      }
      return setHideScrollTop(true);
    };
    window.addEventListener('scroll', onScroll);
  }, [itemSpacing, rootElementRef, topbarHeight]);

  const scrollTopButtonPlacement = React.useMemo(() => {
    if (languageDirection === 'rtl') return 0;
    return rootElementRef.current ? rootElementRef.current.clientWidth - 64 : null;
  }, [languageDirection, rootElementRef]);

  return {
    isHidden: hideScrollTop,
    scrollTopButtonPlacement,
  };
};
