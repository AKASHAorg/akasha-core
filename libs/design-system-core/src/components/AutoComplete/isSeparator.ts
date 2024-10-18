import { Separator } from './types';

export function isSeparator(code: string, separators: Separator[]): code is Separator {
  return !!separators.find(separator => separator === code);
}
