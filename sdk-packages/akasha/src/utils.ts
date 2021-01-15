import { AkashaServicePath, IAkashaModule } from '@akashaproject/sdk-core/lib/IAkashaModule';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { CallableService } from '@akashaproject/sdk-runtime/lib/IDIContainer';
import { Observable } from 'rxjs';

export type SendChannel = (
  servicePath: AkashaServicePath,
  payload?: { method: string; args: object },
) => Observable<any>;

export interface IModuleCallableService {
  [y: string]: CallableService;
}

// /**
//  *
//  * @param servicePath
//  */
// const channelCaller = (servicePath: AkashaServicePath) => {
//   return {
//     get(target, property) {
//       return target(servicePath, property);
//     },
//   };
// };
//
// // ex createCallableService(["module", "SERVICE"], {send(path, payload)=>true)
// // returns callable = { service: ProxyService }
// // can be used like: callable.service(payload)
// export function createCallableService(servicePath: AkashaServicePath, channelSend: SendChannel) {
//   const handler = channelCaller(servicePath);
//   return new Proxy(channelSend, handler);
// }

/**
 *
 * @param currentModule
 * @param channelSend
 */
export function extractCallableServices(
  currentModule: IAkashaModule,
  channelSend: SendChannel,
): IModuleCallableService {
  const exportedCommonServices = {};
  const services = currentModule.availableServices();
  for (const serviceName of Object.keys(services)) {
    const servicePath: AkashaServicePath = services[serviceName];
    // the service path gets curried to it's missing only `method` and `args`
    // see channel.ts for more info on signature
    exportedCommonServices[serviceName] = channelSend(servicePath);
  }
  return exportedCommonServices;
}

// /**
//  *
//  * @param modules
//  * @param channelSend
//  */
// export function buildModuleServiceChannels(
//   modules: IAkashaModule[],
//   channelSend: SendChannel,
// ): IModuleCallableService {
//   const channels: IModuleCallableService = {};
//   for (const currentModule of modules) {
//     const extractedServices = extractCallableServices(currentModule, channelSend);
//     Object.assign(channels, extractedServices);
//   }
//   return channels;
// }

export function startServices(
  modules: IAkashaModule[],
  di: DIContainer,
  globalChannel: Observable<any>,
) {
  for (const moduleInstance of modules) {
    moduleInstance.startServices(di, globalChannel);
  }
}
