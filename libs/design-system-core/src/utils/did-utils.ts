import { truncateMiddle } from './string-utils';

export const truncateDid = (didKey: string, type = 'eth') => {
  if (didKey) {
    if (didKey.length <= 12) return didKey;

    const address = didKey.split(':').pop();
    switch (type) {
      case 'eth':
      case 'solana':
        return truncateMiddle(address, 6, 6);
      default:
        return truncateMiddle(address, 5, 4);
    }
  }
  return '';
};

const ethIdentifier = 'eip155';
const solanaIdentifier = 'solana';

export const getDidNetworkType = (didKey: string): string => {
  if (didKey) {
    if (didKey.includes(ethIdentifier)) {
      return 'eth';
    } else if (didKey.includes(solanaIdentifier)) {
      return 'solana';
    } else {
      return 'did';
    }
  } else {
    return 'noDid';
  }
};
