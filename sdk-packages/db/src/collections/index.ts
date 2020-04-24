import { AKASHAdb } from '../collection.types';
import settingsCollection from './settings';

export default async function initCollections(db: AKASHAdb) {
  const registeredCollections: any = [settingsCollection];
  for (const collectionObj of registeredCollections) {
    const coll = await db.collection(collectionObj);
    coll.sync({
      remote: 'http://localhost:4984/db/',
      options: {
        live: true,
      },
    });
  }
  return db;
}
