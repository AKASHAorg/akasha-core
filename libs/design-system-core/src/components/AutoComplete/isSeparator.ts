import { Separator } from './types';

export function isSeparator(key: string, separators: Separator[]): key is Separator {
  return !!separators.find(separator => separator === key);
}
