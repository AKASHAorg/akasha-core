import IDIContainer from '@akashaproject/sdk-runtime/lib/IDIContainer';
import { CallableService } from '@akashaproject/sdk-runtime/lib/IDIContainer';
import { AkashaServicePath, IAkashaModule } from './IAkashaModule';

// to not import explicit the module interface just for getting the serviceName
export function getServiceName(service: { moduleName: string; providerName: string }) {
  return IAkashaModule.getServiceName(service.moduleName, service.providerName);
}

// ex: getService(di, ["commons_module", "ipfs"])
export function getService(di: IDIContainer, servicePath: AkashaServicePath): CallableService {
  const [moduleName, providerName] = servicePath;
  return di.getService(getServiceName({ moduleName, providerName }));
}

// execute call on service function
export async function callService(
  di: IDIContainer,
  servicePath: AkashaServicePath,
  payload?: object
) {
  const service = getService(di, servicePath);
  return service(payload);
}
