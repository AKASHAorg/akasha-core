import dbConnect from '../../src/db.methods/connect';

let db;
test('creates/connects to a db', async () => {
  const dbName = 'testdb';
  db = await dbConnect(dbName, 'abc123longpassword', 'memory');
  expect(db).toBeDefined();
  expect(db).toHaveProperty('name');
  expect(db.name).toBe(dbName);
  await db.destroy();
});
