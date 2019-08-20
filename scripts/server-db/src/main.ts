import * as MemoryAdapter from 'pouchdb-adapter-memory';
import RxDB from 'rxdb';
import RxDBServerPlugin from 'rxdb/plugins/server';
import settingsCollection from './collections/settings';

RxDB.plugin(RxDBServerPlugin);
RxDB.plugin(MemoryAdapter);
(async () => {
  const db = await RxDB.create({
    adapter: 'memory',
    name: 'test_db',
  });

  // create collection
  const mySchema = {
    title: 'settings schema',
    description: 'contains all the application settings for each ethAddress',
    version: 0,
    type: 'object',

    properties: {
      ethAddress: {
        type: 'string',
        index: true,
      },
      moduleName: {
        type: 'string',
      },
      services: {
        type: 'array',
        uniqueItems: true,
        items: {
          type: 'array',
          maxItems: 2,
          minItems: 2,
          items: {
            type: 'string',
          },
        },
      },
    },
  };
  await db.collection({
    name: 'settings',
    schema: mySchema,
  });

  for (const collection of settingsCollection) {
    await db.settings.insert(collection);
  }

  const port = 3000;
  const path = '/db';
  const serverState = db.server({
    cors: true,
    path,
    port,
  });
  // tslint:disable-next-line:no-console
  console.info(`visit http://localhost:${port}${path} to explore db collections`);
})();
