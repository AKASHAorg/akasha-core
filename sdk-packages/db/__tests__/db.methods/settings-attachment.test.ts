import memAdapter from 'pouchdb-adapter-memory';
import RxDB from 'rxdb';
import settings from '../../src/collections/settings';
import dbConnect from '../../src/db.methods/connect';
import {
  getSettingsAttachment,
  putSettingsAttachment,
  removeSettingAttachment,
} from '../../src/db.methods/settings-attachment';

RxDB.plugin(memAdapter);

let db;
beforeAll(async () => {
  db = await dbConnect('testdb', 'longpassword163', 'memory');
});
afterAll(async () => {
  await db.destroy();
});
beforeEach(async () => {
  if (!db.hasOwnProperty(settings.name)) {
    await db.collection(settings);
    db[settings.name].insert({
      ethAddress: '0xbcf8e878fa680557ec0088151b74699173bb5782',
      moduleName: 'db',
      services: [],
    });
  }
});

test('putSettingsAttachment', async () => {
  const settingsDoc = await db[settings.name].findOne().exec();
  const attachment = await putSettingsAttachment(settingsDoc, {
    id: 'themeId',
    data: JSON.stringify({ color: '#efefef' }),
    type: 'string',
  });
  expect(attachment).toBeDefined();
  expect(attachment).toHaveProperty('id');
  expect(attachment.id).toEqual('themeId');
});

test('getSettingsAttachment', async () => {
  const settingsDoc = await db[settings.name].findOne().exec();
  await putSettingsAttachment(settingsDoc, { id: 'themeId13', data: 'plainText', type: 'string' });
  const attachmentData = await getSettingsAttachment(settingsDoc, 'themeId13');
  expect(attachmentData).toBeDefined();
  expect(attachmentData).toEqual('plainText');
});

test('removeSettingAttachment', async () => {
  const settingsDoc = await db[settings.name].findOne().exec();
  await putSettingsAttachment(settingsDoc, { id: 'longId', data: 'lorem', type: 'string' });
  const attachmentData = await getSettingsAttachment(settingsDoc, 'longId');
  expect(attachmentData).toBeDefined();
  expect(attachmentData).toEqual('lorem');
  await removeSettingAttachment(settingsDoc, 'longId');
  const finalData = await getSettingsAttachment(settingsDoc, 'longId');
  expect(finalData).toBeNull();
});
