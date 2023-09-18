import { Dexie } from 'dexie';
import { ScrollerState } from '@akashaorg/design-system-components/lib/components/EntryList';

export class ScrollStateDBWrapper extends Dexie {
  scrollState!: Dexie.Table<ScrollerState & { id: string }>;

  constructor(dbName: string) {
    super(dbName);
    this.version(1).stores({
      scrollState: 'id',
    });
  }
}
