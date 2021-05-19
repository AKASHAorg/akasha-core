import { Container } from 'inversify';
import { TYPES } from '@akashaproject/sdk-typings';
import { Logging } from './logging';
import { Gql } from './gql';
import { Settings } from './settings';
import { Stash } from './stash';
import { DB } from './db';
import { Web3Connector } from './common/web3.connector';

const diContainer = new Container({
  defaultScope: 'Singleton',
});

diContainer.bind<Logging>(TYPES.Log).to(Logging);
diContainer.bind<Gql>(TYPES.Gql).to(Gql);
diContainer.bind<Settings>(TYPES.Settings).to(Settings);
diContainer.bind<Stash>(TYPES.Stash).to(Stash);
diContainer.bind<DB>(TYPES.Db).to(DB);
diContainer.bind<Web3Connector>(TYPES.Web3).to(Web3Connector);
export default diContainer;
