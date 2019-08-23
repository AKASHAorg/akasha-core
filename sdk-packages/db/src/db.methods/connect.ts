import syncHTTPAdapter from 'pouchdb-adapter-http';
import idb from 'pouchdb-adapter-idb';
import RxDB from 'rxdb';
import { AKASHAdb } from '../collection.types';

// load plugins
RxDB.plugin(idb);
RxDB.plugin(syncHTTPAdapter);

/**
 *
 * @param name
 * @param password, must be at least 8 characters long
 * @param adapter, can be one of 'idb' or 'memory'
 */
export default function dbConnect(name: string, password: string, adapter: string = 'idb') {
  return RxDB.create<AKASHAdb>({
    adapter,
    multiInstance: true,
    name,
    password,
    queryChangeDetection: true,
  });
}
