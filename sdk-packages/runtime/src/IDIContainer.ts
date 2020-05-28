export type CallableService = (payload?: any) => any;
// Dependency Injection Container Interface
export default interface IDIContainer {
  getService(serviceName: string | object): any;

  register(serviceName: string | object, service: CallableService): void;
}
