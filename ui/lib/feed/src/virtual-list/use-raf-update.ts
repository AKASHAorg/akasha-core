import React from 'react';

export const useRAFUpdate = (updateFn: (debugFrom?: string) => void) => {
  const updateRef = React.useRef(updateFn);
  const animationFrameId = React.useRef<ReturnType<typeof requestAnimationFrame>>(null);

  React.useEffect(() => {
    updateRef.current = updateFn;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, [updateFn]);
  React.useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);
  return React.useCallback((debugFrom?: string) => {
    animationFrameId.current = requestAnimationFrame(() => {
      updateRef.current(debugFrom);
    });
  }, []);
};
