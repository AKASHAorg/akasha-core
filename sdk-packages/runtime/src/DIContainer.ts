import Bottle from 'bottlejs';
import IDIContainer, { CallableService } from './IDIContainer';

export default class DIContainer implements IDIContainer {
  // service provider instance
  protected readonly sp;

  constructor() {
    this.sp = new Bottle('RuntimeDIContainer');
  }

  get serviceProvider() {
    return this.sp;
  }

  public getService(serviceName: string) {
    return this.sp.container[serviceName];
  }

  public register(serviceName: string, service: CallableService): void {
    this.sp.service(serviceName, service);
  }
}
