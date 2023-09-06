import { Dexie } from 'dexie';
import { ScrollerState } from '@akashaorg/design-system-components/lib/components/EntryList';

export interface ScrollStateSchema {
  id: string;
  measurementsCache: {
    end: number;
    index: number;
    key: string | number;
    lane: number;
    size: number;
    start: number;
  }[];
  // first item in the loaded list
  startItemCursor: string;
  startItemOffset: number;
  scrollDirection: ScrollerState['scrollDirection'];
  itemsCount: number;
  // the first item in the virtual list's visible range
  firstItemCursor?: string;
  // last item in the virtual list's visible range
  lastItemCursor?: string;
}

export class ScrollStateDBWrapper extends Dexie {
  scrollState!: Dexie.Table<ScrollStateSchema>;

  constructor(dbName: string) {
    super(dbName);
    this.version(1).stores({
      scrollState: 'id',
    });
  }
}
