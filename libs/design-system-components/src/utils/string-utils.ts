export const capitalize = (str?: string) => {
  return str!
    .split(' ')
    .map(subs => `${subs.substr(0, 1).toUpperCase()}${subs.substr(1, subs.length - 1)}`)
    .join(' ');
};

export const truncateMiddle = (str: string, startChars = 6, endChars = 4) => {
  if (str) {
    let truncated = '';
    truncated += str.substring(0, startChars);
    truncated += '...';
    truncated += str.substring(str.length - endChars, str.length);
    return truncated;
  }
  return '';
};

/**
 * Check if is base64 encoded...
 * Simple check
 */
export const isBase64 = (str: string) => {
  if (str.length > 0 && typeof str === 'string') {
    if (str.startsWith('data:') && /;base64/.test(str)) {
      return true;
    }
    return false;
  }
  return false;
};

export const isBlob = (str: string) => {
  if (str.length && typeof str === 'string') {
    if (str.startsWith('blob:http')) {
      return true;
    }
    return false;
  }
  return false;
};
