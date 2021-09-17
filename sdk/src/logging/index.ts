import { injectable } from 'inversify';
import ILogService, { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import pino from 'pino';

@injectable()
class Logging implements ILogService {
  private _appLogger: pino;
  public constructor() {
    this._appLogger = pino({ browser: { asObject: true }, level: 'error' });
  }

  /**
   *
   * @param nameSpace - Logger name attribute
   * @returns ILogger
   */
  create(nameSpace?: string): ILogger {
    const logger = this._appLogger.child({ module: nameSpace });
    logger.level = process.env.LOG_LEVEL || 'info';
    return logger;
  }
}

export default Logging;
