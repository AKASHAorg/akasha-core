import IGqlClient from './interfaces/gql';
import ILog from './interfaces/log';
import IStash from './interfaces/stash';
import ISettingsService from './interfaces/settings';

export default interface IServices {
  gql: IGqlClient;
  log: ILog;
  stash: IStash;
  settings: ISettingsService;
}
