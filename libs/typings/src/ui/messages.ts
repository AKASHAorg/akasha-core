import { Descendant } from 'slate';
import { Profile } from './profile';

export type IChatMessage = Profile & {
  read?: boolean;
  content: Descendant[];
  timestamp: string;
  id?: string;
  from?: string;
  to?: string;
};
