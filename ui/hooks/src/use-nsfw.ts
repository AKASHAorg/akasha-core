import { useState } from 'react';

const NsfwChoice = 'Show-Nsfw';
/**
 * Hook to get and set user's choice for showing/hiding nsfw content
 * @example useNsfwToggling hook
 * ```typescript
 * const {showNsfw, toggleShowNsfw} = useNsfwToggling();
 * ```
 * To toggle the nsfw state, pass a boolean value to the toggleShowNsfw function,
 *  e.g. `toggleShowNsfw(true)`
 */
export function useNsfwToggling() {
  const currentNsfwSelection = JSON.parse(window.localStorage.getItem(NsfwChoice));

  /**
   * If currentNsfwSelection is null, meaning no previous preference is stored in
   *  local storage, the default value is set to false (No nsfw content is shown
   * in the antenna), otherwise, get the previously stored preference
   * from the local storage.
   */
  const [showNsfw, setShowNsfw] = useState<boolean>(
    currentNsfwSelection === null ? false : currentNsfwSelection,
  );

  const toggleShowNsfw = (showNsfw: boolean) => {
    setShowNsfw(showNsfw);
    window.localStorage.setItem(NsfwChoice, JSON.stringify(showNsfw));
  };

  return { showNsfw, toggleShowNsfw };
}
