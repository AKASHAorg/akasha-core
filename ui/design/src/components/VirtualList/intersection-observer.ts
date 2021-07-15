import React from 'react';

export default function useIntersectionObserver({
  target,
  onIntersect,
  threshold = 1.0,
  rootMargin = '0px',
  enabled = true,
}) {
  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => entry.isIntersecting && onIntersect()),
      {
        rootMargin,
        threshold,
      },
    );

    const el = target && target.current;

    if (!el) {
      return;
    }

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [target.current, enabled]);
}
