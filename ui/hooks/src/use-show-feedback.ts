import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function useShowFeedback(
  initialShowValue?: boolean,
): [boolean, Dispatch<SetStateAction<boolean>>] {
  const [showFeedback, setShowFeedback] = useState(initialShowValue);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowFeedback(false);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showFeedback]);

  return [showFeedback, setShowFeedback];
}
