import { injectable } from 'inversify';
import ILogService, { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import { ServiceCallResult } from '@akashaproject/sdk-typings/lib/interfaces';
import pino from 'pino';
import { createObservableValue } from '../helpers/observable';

@injectable()
class Logging implements ILogService {
  private _appLogger: pino;
  public constructor() {
    this._appLogger = pino({ browser: { asObject: true } });
  }

  /**
   *
   * @param nameSpace - Logger name attribute
   * @returns ServiceCallResult<ILogger>
   */
  create(nameSpace?: string): ServiceCallResult<ILogger> {
    const log: ILogger = this._appLogger.child({ module: nameSpace });
    return createObservableValue<ILogger>(log);
  }
}

export { Logging };
