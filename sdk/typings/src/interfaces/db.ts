import { ServiceCallResult } from './responses';

export default interface IDBService<DB, Collection> {
  open(version: number): ServiceCallResult<DB>;
  getDb(): ServiceCallResult<DB>;
  getCollection(name: string): ServiceCallResult<Collection>;
}
