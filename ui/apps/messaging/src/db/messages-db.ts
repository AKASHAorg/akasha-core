import Dexie, { Table } from 'dexie';
import { IChatMessage } from '@akashaorg/typings/lib/ui';

export interface Message extends IChatMessage {
  loggedUserId: string;
  chatPartnerId: string;
}

export class LocalMessagesDexie extends Dexie {
  messages!: Table<Message>;

  constructor() {
    super('MessagesDatabase');
    this.version(1).stores({
      messages: '&id, from, to, timestamp, [loggedUserId+chatPartnerId]',
    });
  }
}

export const db = new LocalMessagesDexie();
