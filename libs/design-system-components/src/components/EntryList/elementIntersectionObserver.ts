interface ITargetInterseced {
  onIntersect: () => void;
  element?: HTMLElement;
}

export function elementIntersectionObserver({ element, onIntersect }: ITargetInterseced) {
  const observer = new IntersectionObserver(entries => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      onIntersect();
    }
  });
  if (element) {
    observer.observe(element);
  }
  return observer;
}
