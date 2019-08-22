import { AKASHAdb } from '../collection.types';
import settingsCollection from './settings';

export default async function initCollections(db: AKASHAdb) {
  const registeredCollections: any = [settingsCollection];
  for (const collectionObj of registeredCollections) {
    await db.collection(collectionObj);
  }
  return db;
}
