import { injectable } from 'inversify';
import DBService from '@akashaproject/sdk-typings/lib/interfaces/db';
import { ObservableCallResult } from '@akashaproject/sdk-typings/lib/interfaces/basic';

@injectable()
class DB implements DBService {
  private _dbName: string;
  constructor(name: string) {
    this._dbName = name;
  }

  getCollection(name: string): ObservableCallResult<any> {
    return undefined;
  }
}

export { DB };
