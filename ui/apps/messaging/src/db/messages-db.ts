import Dexie, { Table } from 'dexie';
import { IChatMessage } from '@akashaorg/typings/ui';

export interface Message extends IChatMessage {
  loggedUserPubKey: string;
  chatPartnerPubKey: string;
}

export class LocalMessagesDexie extends Dexie {
  messages!: Table<Message>;

  constructor() {
    super('MessagesDatabase');
    this.version(1).stores({
      messages:
        'id, from, to, timestamp, loggedUserPubKey, chatPartnerPubKey, [loggedUserPubKey+chatPartnerPubKey]',
    });
  }
}

export const db = new LocalMessagesDexie();
