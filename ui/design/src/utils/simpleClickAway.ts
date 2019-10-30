import { useEffect } from 'react';

export default function useSimpleClickAway(
  wrapperRef: React.RefObject<any>,
  handler: () => void | undefined,
) {
  useEffect(() => {
    if (wrapperRef.current) {
      document.addEventListener('click', handleClick);
    }
    return () => document.removeEventListener('click', handleClick);
    function handleClick(ev: Event) {
      // tslint:disable-next-line: no-unused-expression
      wrapperRef.current && !wrapperRef.current.contains(ev.target) && handler && handler();
    }
  }, [handler, wrapperRef]);
}
