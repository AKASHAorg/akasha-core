import memAdapter from 'pouchdb-adapter-memory';
import RxDB from 'rxdb';
import dbConnect from '../../src/db.methods/connect';

RxDB.plugin(memAdapter);

let db;
test('creates/connects to a db', async () => {
  const dbName = 'testdb';
  db = await dbConnect(dbName, 'abc123longpassword', 'memory');
  expect(db).toBeDefined();
  expect(db).toHaveProperty('name');
  expect(db.name).toBe(dbName);
  await db.destroy();
});
