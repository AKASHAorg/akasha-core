import { Container } from 'inversify';
import { TYPES } from '@akashaproject/sdk-typings';
import Logging from './logging';
import Gql from './gql';
import Settings from './settings';
import Stash from './stash';
import DB from './db';
import Web3Connector from './common/web3.connector';
import EventBus from './common/event-bus';
import AWF_Auth from './auth';
const diContainer = new Container({
  defaultScope: 'Singleton',
});

diContainer.bind<Logging>(TYPES.Log).to(Logging);
diContainer.bind<Gql>(TYPES.Gql).to(Gql);
diContainer.bind<Settings>(TYPES.Settings).to(Settings);
diContainer.bind<Stash>(TYPES.Stash).to(Stash);
console.log('Stash', diContainer.get<Stash>(TYPES.Stash));
diContainer.bind<DB>(TYPES.Db).to(DB);
diContainer.bind<EventBus>(TYPES.EventBus).to(EventBus);
console.log('dbini', diContainer.get<DB>(TYPES.Db));
diContainer.bind<Web3Connector>(TYPES.Web3).to(Web3Connector);
diContainer.bind<AWF_Auth>(TYPES.Auth).to(AWF_Auth);
export default diContainer;
