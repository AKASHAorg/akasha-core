import Bottle from 'bottlejs';
import IDIContainer from './IDIContainer';

export default class DIContainer implements IDIContainer {

  // service provider instance
  readonly _sp;

  constructor () {
    this._sp = new Bottle('RuntimeDIContainer');
  }

  get serviceProvider () {
    return this._sp;
  }

  public getService (serviceName: string ) {
    return this._sp.container[serviceName];
  }

  public register (serviceName: string, service: CallableFunction): void {
    this._sp.service(serviceName, service);
  }
}
