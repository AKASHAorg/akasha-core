import { useEffect } from 'react';

export default function useSimpleClickAway(
  wrapperRef: React.RefObject<any>,
  handler: (e: any) => void | undefined,
) {
  useEffect(() => {
    if (wrapperRef.current) {
      document.addEventListener('click', handleClick);
    }
    return () => document.removeEventListener('click', handleClick);

    function handleClick(ev: Event) {
      ev.stopPropagation();
      if (wrapperRef.current && !wrapperRef.current.contains(ev.target) && handler) {
        handler(ev);
      }
    }
  }, [handler, wrapperRef]);
}
