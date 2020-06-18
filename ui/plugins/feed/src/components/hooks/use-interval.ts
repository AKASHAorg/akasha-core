import * as React from 'react';

export const useInterval = (cb: (ticks?: number) => void, delay: number) => {
  const callback = React.useRef<typeof cb>();
  const [ticks, setTicks] = React.useState(0);

  React.useEffect(() => {
    callback.current = cb;
  }, [cb]);

  React.useEffect(() => {
    const tick = () => {
      if (callback.current) {
        callback.current(ticks);
        setTicks(prev => prev + 1);
      }
    };
    if (delay) {
      const id = setInterval(tick, delay);
      return () => {
        clearInterval(id);
      };
    }
    return () => undefined;
  }, [delay, ticks]);
};
