export const capitalize = (str?: string) => {
  return str!
    .toLowerCase()
    .split(' ')
    .map(subs => `${subs.charAt(0).toUpperCase()}${subs.slice(1)}`)
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
