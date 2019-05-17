import Bottle from 'bottlejs';
import IDIContainer from './IDIContainer';

export default class DIContainer implements IDIContainer {

  // service provider instance
  readonly _sp;

  constructor () {
    this._sp = new Bottle('RuntimeDIContainer');
  }

  public getService (serviceName: String | Object): CallableFunction {
    return this._sp.service(serviceName);
  }

  public register (serviceName: String | Object, service: CallableFunction): void {
    this._sp.service(serviceName, service);
  }

  get serviceProvider() {
    return this._sp;
  }
}
