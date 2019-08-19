import idb from 'pouchdb-adapter-idb';
import RxDB from 'rxdb';
import { AKASHAdb } from '../collection.types';

// load the plugin
RxDB.plugin(idb);

export default function dbConnect(name: string, password: string) {
  return RxDB.create<AKASHAdb>({
    adapter: 'idb',
    multiInstance: true,
    name,
    password,
    queryChangeDetection: true,
  });
}
