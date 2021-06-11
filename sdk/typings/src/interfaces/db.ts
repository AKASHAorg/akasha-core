import { ObservableCallResult } from './responses';

export default interface IDBService<DB, Collection> {
  open(version: number): ObservableCallResult<DB>;
  getDb(): ObservableCallResult<DB>;
  getCollection(name: string): ObservableCallResult<Collection>;
}
