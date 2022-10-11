import { Descendant } from 'slate';

export interface IChatMessage {
  name?: string;
  username?: string;
  ethAddress: string;
  read?: boolean;
  content: Descendant[];
  timestamp: string;
  id?: string;
  from?: string;
  to?: string;
}
