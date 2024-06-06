import { Dispatch, SetStateAction, useEffect, useState } from 'react';

/**
 * Hook to manage the state of the feedback shown in the snackbar.
 * @example useTheme hook
 * ```typescript
 *   const [showFeedback, setShowFeedback] = useShowFeedback();
 * ```
 * @param initialShowValue - boolean (optional)
 * @returns { showFeedback, setShowFeedback } The state of whether to
 * show the feedback message and a function to set that state.
 **/
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
