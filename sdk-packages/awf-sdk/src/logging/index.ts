import { injectable, inject } from 'inversify';
import ILogService, { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import { ObservableCallResult } from '@akashaproject/sdk-typings/lib/interfaces/responses';
import pino from 'pino';
import { createObservableValue } from '../helpers/observable';

@injectable()
class Logging implements ILogService {
  private _appLogger;
  public constructor() {
    this._appLogger = pino({ browser: { asObject: true } });
  }
  create(nameSpace?: string): ObservableCallResult<ILogger> {
    const log: ILogger = this._appLogger.child({ module: nameSpace });
    return createObservableValue(log);
  }
}

export { Logging };
