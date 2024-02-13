const modifiers = ['and', 'or', 'of'];

/**
 * Utility to return a prefix from a specified vibe reason
 * @param reason - string
 */
export default function getReasonPrefix(reason: string): string {
  let prefix = '';
  // split the words in the reason
  const words = reason.split(' ');

  // if one word
  if (words.length === 1) {
    // pick first two letters, capitalised
    prefix = words[0].slice(0, 2);
  }
  // else
  else {
    // remove modifiers
    const filtered = words.filter(word => !modifiers.includes(word));

    // pick first letters of first two words, capitalised
    prefix = `${filtered[0].charAt(0)}${filtered[1].charAt(0)}`;
  }

  return prefix.toUpperCase();
}
