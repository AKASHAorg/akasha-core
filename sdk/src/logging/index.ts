import { injectable } from 'inversify';
import ILogService, { ILogger } from '@akashaproject/sdk-typings/src/interfaces/log';
import pino from 'pino';

@injectable()
class Logging implements ILogService {
  private _appLogger: pino;
  public constructor() {
    this._appLogger = pino({ browser: { asObject: true } });
  }

  /**
   *
   * @param nameSpace - Logger name attribute
   * @returns ILogger
   */
  create(nameSpace?: string): ILogger {
    return this._appLogger.child({ module: nameSpace });
  }
}

export default Logging;
