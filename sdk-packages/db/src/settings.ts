import { IGeneralSettings } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { DB_NAME, DB_PASSWORD, DB_SYNC_ENDPOINT } from './constants';

const settings: IGeneralSettings = [
  [DB_SYNC_ENDPOINT, 'http://localhost:3000/db'],
  [DB_NAME, 'akashadb.alpha0'],
  [DB_PASSWORD, 'SOMELONGPASSWORD123asdasdasda'],
];

export default settings;
