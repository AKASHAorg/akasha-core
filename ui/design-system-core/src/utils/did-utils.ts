import { truncateMiddle } from './string-utils';

export const truncateDid = (didKey: string, type = 'eth') => {
  if (didKey) {
    if (didKey.length <= 12) return didKey;

    const address = didKey.split(':').pop();
    switch (type) {
      case 'eth':
      case 'solana':
        return truncateMiddle(address, 6, 6);
        break;
      default:
        return truncateMiddle(address, 5, 4);
        break;
    }
  }
  return '';
};
