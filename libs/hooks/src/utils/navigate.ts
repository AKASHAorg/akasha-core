const NAVIGATE_KEY = '__navigate__';

/**
 * Sets a navigation trigger flag in localStorage.
 * This is meant to be read once by another component,
 * and cleared immediately after reading.
 */
function triggerNavigation(): void {
  localStorage.setItem(NAVIGATE_KEY, 'true');
}

/**
 * Checks if navigation should occur.
 * This reads the one-time flag from localStorage and clears it after use.
 * @returns true if navigation was triggered; false otherwise.
 */
function shouldNavigate(): boolean {
  const value = localStorage.getItem(NAVIGATE_KEY);
  localStorage.removeItem(NAVIGATE_KEY);
  return value === 'true';
}

export { triggerNavigation, shouldNavigate };
