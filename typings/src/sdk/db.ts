import { ServiceCallResult } from './responses';

interface IDBService<DB, Collection> {
  open(version: number): ServiceCallResult<DB>;
  getDb(): ServiceCallResult<DB>;
  getCollection(name: string): ServiceCallResult<Collection>;
}

export default IDBService;
