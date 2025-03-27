const NAVIGATE_KEY = '__navigate__';

/**
 * Sets a navigation trigger flag in sessionStorage.
 * This is meant to be read once by another component,
 * and cleared immediately after reading.
 */
function triggerNavigation(): void {
  sessionStorage.setItem(NAVIGATE_KEY, 'true');
}

/**
 * Checks if navigation should occur.
 * This reads the one-time flag from sessionStorage and clears it after use.
 * @returns true if navigation was triggered; false otherwise.
 */
function shouldNavigate(): boolean {
  const value = sessionStorage.getItem(NAVIGATE_KEY);
  sessionStorage.setItem(NAVIGATE_KEY, 'false');
  return value === 'true';
}

export { triggerNavigation, shouldNavigate };
