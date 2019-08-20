import settings from '../../src/collections/settings';
import dbConnect from '../../src/db.methods/connect';

let db;
const delay = ms => new Promise(res => setTimeout(res, ms));
beforeAll(async () => {
  db = await dbConnect('testdb1', 'longpassword123', 'memory');
});

test('creates settings collection', async () => {
  await db.collection(settings);
  expect(db).toHaveProperty(settings.name);
});

// must start script:dev-db before running this
test('syncs from the endpoint', async () => {
  if (!db.hasOwnProperty(settings.name)) {
    await db.collection(settings);
  }
  const replication = db[settings.name].sync({
    remote: 'http://localhost:3000/db/settings',
  });
  await delay(2000);
  const settingsCollection = await db[settings.name].find().exec();
  expect(settingsCollection).toBeDefined();
  // tslint:disable-next-line:no-console
  console.log(settingsCollection[0].toJSON());
  expect(settingsCollection[0].toJSON()).toHaveProperty('moduleName');
  await replication.cancel();
});

afterAll(async () => {
  await db.destroy();
});
