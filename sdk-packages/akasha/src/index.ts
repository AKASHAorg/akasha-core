import registerCommonModule from '@akashaproject/sdk-common';
import initDI from '@akashaproject/sdk-core';
import { IAkashaModule } from '@akashaproject/sdk-core/lib/IAkashaModule';
import registerDBModule from '@akashaproject/sdk-db';
import registerAuthModule from '@akashaproject/sdk-auth';
import registerProfilesModule from '@akashaproject/sdk-profiles';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import AppLoader from '@akashaproject/sdk-ui-plugin-loader';
import {
  ILoaderConfig,
  IPluginEntry,
  IWidgetEntry,
} from '@akashaproject/ui-awf-typings/lib/app-loader';
import initChannel from './channel';
import * as operators from 'rxjs/operators';
import { forkJoin, from, zip, of, concat } from 'rxjs';

import {
  buildModuleServiceChannels,
  IModuleCallableService,
  SendChannel,
  startServices,
} from './utils';

const initDiChannel = (di: DIContainer, sendChannel: SendChannel) => {
  return (mList: IAkashaModule[]): IModuleCallableService => {
    startServices(mList, di);
    // build the module services for the sdk consumer
    return buildModuleServiceChannels(mList, sendChannel);
  };
};

export function init(appLoaderOptions: {
  config: ILoaderConfig;
  initialApps: { plugins?: IPluginEntry[]; widgets?: IWidgetEntry[] };
}) {
  // tslint:disable-next-line:no-console
  const di: DIContainer = initDI();
  const commonModule = registerCommonModule();
  const dbModule = registerDBModule();
  const authModule = registerAuthModule();
  const profilesModule = registerProfilesModule();
  // list of all the registered modules for the sdk
  const modulesList = [commonModule, dbModule, authModule, profilesModule];
  // general channel to send service calls
  const channel = initChannel(di);
  // prepare the start function for integrations
  const start = initDiChannel(di, channel.send);
  const modules: IModuleCallableService = start(modulesList);
  const channelUtils = { operators: operators, observable: { forkJoin, from, zip, of, concat } };
  const appLoader = new AppLoader(
    appLoaderOptions.config,
    appLoaderOptions.initialApps,
    modules,
    channelUtils,
  );
  return Object.assign({}, modules, {
    appLoader,
    channelUtils,
  });
}
