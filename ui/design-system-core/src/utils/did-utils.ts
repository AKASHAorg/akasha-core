import { IconType } from '@akashaorg/typings/lib/ui';
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

const ethIdentifier = 'eip155';
const solanaIdentifier = 'solana';
const didKeyIdentifier = 'key';

export const iconForDid = (didKey: string): IconType => {
  if (didKey) {
    if (didKey.includes(ethIdentifier)) {
      return 'eth';
    }
    // modify if we recognize more than 3 types of keys
    return didKey.includes(solanaIdentifier) ? 'solana' : 'didKey';
  }
  return null;
};
