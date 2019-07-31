import { AkashaServicePath, IAkashaModule } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { Observable } from 'rxjs';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';

type SendChannel = (servicePath: AkashaServicePath, payload: object) => Observable<any>
/**
 *
 * @param servicePath
 */
const channelCaller = function (servicePath: AkashaServicePath) {
  return {
    apply: function(target, thisArg, argumentsList: [object]) {
      return target(servicePath, argumentsList[0]) ;
    }
  }
};

// ex createCallableService(["module", "SERVICE"], {send: (path, payload)=>true})
// returns callable = { service: ProxyService }
// can be used like: callable.service(payload)
export function createCallableService(servicePath: AkashaServicePath, channelSend: SendChannel) {
  const handler = channelCaller(servicePath);
  return new Proxy(channelSend, handler);
}

/**
 *
 * @param currentModule
 * @param channelSend
 */
export function extractCallableServices(currentModule: IAkashaModule, channelSend: SendChannel) {
  const exportedCommonServices = {};
  const services = currentModule.availableServices();
  for (const serviceName of  Object.keys(services)) {
    const servicePath: AkashaServicePath = services[serviceName];
    exportedCommonServices[serviceName.toLowerCase()] = createCallableService(servicePath, channelSend)
  }
  return { [currentModule.name]: exportedCommonServices };
}

/**
 *
 * @param modules
 * @param channelSend
 */
export function buildModuleServiceChannels(modules: IAkashaModule[], channelSend: SendChannel) {
  let channels = {};
  for(const currentModule of modules) {
    const extractedServices = extractCallableServices(currentModule, channelSend);
    Object.assign(channels, extractedServices);
  }
  return channels;
}

export async function startServices(modules: IAkashaModule[], di: DIContainer): Promise<void> {
  for (const moduleInstance of modules) {
    await moduleInstance.startServices(di);
  }
}
