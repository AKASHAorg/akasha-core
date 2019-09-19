import memAdapter from 'pouchdb-adapter-memory';
import RxDB from 'rxdb';
import settings from '../../src/collections/settings';
import dbConnect from '../../src/db.methods/connect';

RxDB.plugin(memAdapter);

let db;
const delay = ms => new Promise(res => setTimeout(res, ms));
beforeAll(async () => {
  db = await dbConnect('testdb1', 'longpassword123', 'memory');
});

beforeEach(async () => {
  if (!db.hasOwnProperty(settings.name)) {
    await db.collection(settings);
  }
});

test('creates settings collection', async () => {
  expect(db).toHaveProperty(settings.name);
});

// must start script:dev-db before running this
test('syncs from the endpoint', async () => {
  const replication = db[settings.name].sync({
    remote: 'http://localhost:3000/db/settings',
  });
  await delay(2000);
  const settingsCollection = await db[settings.name].find().exec();
  expect(settingsCollection).toBeDefined();
  expect(settingsCollection[0].toJSON()).toHaveProperty('moduleName');
  await replication.cancel();
});

test('inserts a new settings document', async () => {
  db[settings.name].insert({
    ethAddress: '0xbc98e878fa680557ec0088151b74699173bb5782',
    moduleName: 'testModule',
    services: [['serviceN', 'optionN'], ['vendorS', '{json}']],
  });
  const doc = await db[settings.name]
    .findOne({
      $and: [
        { ethAddress: { $eq: '0xbc98e878fa680557ec0088151b74699173bb5782' } },
        { moduleName: { $eq: 'testModule' } },
      ],
    })
    .exec();
  expect(doc.getSettingsObject()).toHaveProperty('vendorS');
  expect(doc.getSettingsObject()).toHaveProperty('serviceN');
});

test('calls collection methods', async () => {
  db[settings.name].insert({
    ethAddress: '0xbc98e878fa680557ec0088151b74699173bb5711',
    moduleName: 'collectionModule',
    services: [['insert', '1'], ['collect', '{a: 2}']],
  });
  const docs = await db[settings.name].getAllSettings('0xbc98e878fa680557ec0088151b74699173bb5711');
  expect(docs[0].getSettingsObject()).toHaveProperty('insert');
  expect(docs[0].getSettingsObject()).toHaveProperty('collect');
});

afterAll(async () => {
  await db.destroy();
});
