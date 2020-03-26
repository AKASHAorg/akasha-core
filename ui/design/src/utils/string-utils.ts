export const capitalize = (str?: string) => {
  return str!
    .split(' ')
    .map(subs => `${subs.substr(0, 1).toUpperCase()}${subs.substr(1, subs.length - 1)}`)
    .join(' ');
};

export const truncateMiddle = (str: string, startChars: number, endChars: number) => {
  let truncated = '';
  truncated += str.substring(0, startChars);
  truncated += '...';
  truncated += str.substring(str.length - endChars, str.length);
  return truncated;
};
