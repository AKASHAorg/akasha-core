import { Descendant } from 'slate';
import { Profile } from '../sdk/graphql-types-new';

export type IChatMessage = Profile & {
  read?: boolean;
  content: Descendant[];
  timestamp: string;
  id?: string;
  from?: string;
  to?: string;
};
