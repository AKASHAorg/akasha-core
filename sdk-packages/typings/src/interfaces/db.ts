import { ObservableCallResult } from './responses';

export default interface IDBService {
  open(version: number): ObservableCallResult<any>;
  getDb(): ObservableCallResult<any>;
  getCollection(name: string): ObservableCallResult<any>;
}
