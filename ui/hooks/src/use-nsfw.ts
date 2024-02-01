import { useState } from 'react';

const NsfwChoice = 'Show-Nsfw';
/**
 * Hook to get and set user's choice for showing/hiding nsfw content
 * @example useNsfwToggling hook
 * ```typescript
 * const {showNsfw, toggleShowNsfw} = useNsfwToggling();
 * ```
 */
export function useNsfwToggling() {
  const currentNsfwSelection = JSON.parse(window.localStorage.getItem(NsfwChoice));

  const [showNsfw, setShowNsfw] = useState<boolean>(
    currentNsfwSelection === null ? false : currentNsfwSelection,
  );

  const toggleShowNsfw = showNsfw => {
    setShowNsfw(showNsfw);
    window.localStorage.setItem(NsfwChoice, JSON.stringify(showNsfw));
  };

  return { showNsfw, toggleShowNsfw };
}
