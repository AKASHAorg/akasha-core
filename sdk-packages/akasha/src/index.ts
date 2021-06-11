import initDI from '@akashaproject/sdk-core';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { ISdkConfig } from '@akashaproject/ui-awf-typings/lib/app-loader';
import initChannel, { globalChannel } from './channel';
import startApi from './api';

export default async function init(_config: ISdkConfig) {
  const di: DIContainer = initDI();
  // general channel to send service calls
  const channel = initChannel(di);
  const apiChannels = await startApi(channel, di, globalChannel);
  return Object.assign({}, apiChannels, {
    globalChannel: globalChannel,
  });
}
