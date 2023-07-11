import { IconType } from '@akashaorg/typings/ui';
import { truncateMiddle } from './string-utils';

export const truncateDid = (didKey: string, type = 'eth') => {
  if (didKey) {
    const address = didKey.split(':').pop();
    switch (type) {
      case 'eth':
        return truncateMiddle(address, 6, 6);
        break;
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

const EthIdentifier = 'eip155';
const SolanaIdentifier = 'solana';
const DidKeyIdentifier = 'key';

export const iconForDid = (didKey: string): IconType => {
  if (didKey.includes(EthIdentifier)) {
    return 'eth';
  }
  // modify if we recognize more than 3 types of keys
  return didKey.includes(SolanaIdentifier) ? 'solana' : 'didKey';
};
