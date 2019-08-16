import idb from 'pouchdb-adapter-idb';
import RxDB from 'rxdb';

// load the plugin
RxDB.plugin(idb);

export default function dbConnect(name: string, password: string) {
  return RxDB.create({
    adapter: 'idb',
    multiInstance: true,
    name,
    password,
    queryChangeDetection: true,
  });
}
