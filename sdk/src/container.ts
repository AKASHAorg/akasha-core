import { Container } from 'inversify';
import { TYPES } from '@akashaorg/typings/sdk';
import Logging from './logging';
import Gql from './gql';
import GqlNew from './gql/index.new';
import Settings from './settings';
import Stash from './stash';
import DB from './db';
import Web3Connector from './common/web3.connector';
import EventBus from './common/event-bus';
import AWF_Auth from './auth';
import AWF_Profile from './profiles';
import AWF_ENS from './registry/ens';
import AWF_IC_REGISTRY from './registry/icRegistry';
import AWF_Entry from './posts/entry';
import AWF_Comments from './posts/comments';
import AWF_Tags from './posts/tags';
import AWF_IpfsConnector from './common/ipfs.connector';
import AppSettings from './settings/apps';
import AWF_Misc from './common/misc';
import AWF_Lit from './common/lit';
import AWF_Ceramic from './common/ceramic';

const diContainer = new Container({
  defaultScope: 'Singleton',
});
diContainer.bind<AWF_Misc>(TYPES.Misc).to(AWF_Misc);
diContainer.bind<Logging>(TYPES.Log).to(Logging);
diContainer.bind<Gql>(TYPES.Gql).to(Gql);
diContainer.bind<Settings>(TYPES.Settings).to(Settings);
diContainer.bind<Stash>(TYPES.Stash).to(Stash);
diContainer.bind<DB>(TYPES.Db).to(DB);
diContainer.bind<EventBus>(TYPES.EventBus).toDynamicValue(() => new EventBus());
diContainer.bind<Web3Connector>(TYPES.Web3).to(Web3Connector);
diContainer.bind<AWF_Auth>(TYPES.Auth).to(AWF_Auth);
diContainer.bind<AWF_Profile>(TYPES.Profile).to(AWF_Profile);
diContainer.bind<AWF_ENS>(TYPES.ENS).to(AWF_ENS);
diContainer.bind<AWF_Entry>(TYPES.Entry).to(AWF_Entry);
diContainer.bind<AWF_Comments>(TYPES.Comment).to(AWF_Comments);
diContainer.bind<AWF_Tags>(TYPES.Tag).to(AWF_Tags);
diContainer.bind<AWF_IpfsConnector>(TYPES.IPFS).to(AWF_IpfsConnector);
diContainer.bind<AppSettings>(TYPES.AppSettings).to(AppSettings);
diContainer.bind<AWF_IC_REGISTRY>(TYPES.ICRegistry).to(AWF_IC_REGISTRY);
diContainer.bind<AWF_Lit>(TYPES.Lit).to(AWF_Lit);
diContainer.bind<AWF_Ceramic>(TYPES.Ceramic).to(AWF_Ceramic);
diContainer.bind(TYPES.GqlNew).to(GqlNew);

//@Todo: implement init watcher to prevent ambiguous service
// export const importLazy = async () => {
//   const r = await import('./gql/index.new');
//   diContainer.bind<GqlNew>(TYPES.GqlNew).to(r.default);
// };
export default diContainer;
