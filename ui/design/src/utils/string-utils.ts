export const capitalize = (str?: string) => {
  return str!
    .split(' ')
    .map(subs => `${subs.substr(0, 1).toUpperCase()}${subs.substr(1, subs.length - 1)}`)
    .join(' ');
};
