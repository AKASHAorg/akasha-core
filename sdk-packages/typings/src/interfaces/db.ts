import { ObservableCallResult } from './responses';

export default interface IDBService {
  getCollection(name: string): ObservableCallResult<any>;
}
