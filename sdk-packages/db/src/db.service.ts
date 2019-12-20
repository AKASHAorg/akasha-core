import coreServices from '@akashaproject/sdk-core/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import RxDB from 'rxdb';
import { AKASHAdb } from './collection.types';
import initCollections from './collections';
import { DB_NAME, DB_PASSWORD, DB_SERVICE, moduleName } from './constants';
import connect from './db.methods/connect';

const service: AkashaService = (invoke, log) => {
  let akashaDB: AKASHAdb;
  const dbConnect = async (refresh: boolean = false) => {
    if (!refresh && RxDB.isRxDatabase(akashaDB)) {
      log.info('reusing existing DB connection');
      return akashaDB;
    }
    const { getSettings } = invoke(coreServices.SETTINGS_SERVICE);
    const dbSettings = await getSettings(moduleName);
    if (!dbSettings.hasOwnProperty(DB_PASSWORD)) {
      throw new Error('Set a db password before using the service.');
    }
    const db = await connect(dbSettings[DB_NAME], dbSettings[DB_PASSWORD]);
    akashaDB = await initCollections(db);
    return akashaDB;
  };
  return { getDB: dbConnect };
};

export default { name: DB_SERVICE, service: service };
